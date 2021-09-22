import { SelectionModel } from '@angular/cdk/collections'
import { FlatTreeControl } from '@angular/cdk/tree'
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { PoiTypeNodeFlat, PoiTypeNode, ChecklistDatabase } from './poi-type-tree.service'
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree'
import { PoiType } from '@targomo/core'
import { QualityService } from 'services/quality.service'
import { ClientOptionService } from 'services/client-option.service'

@Component({
  selector: 'tgm-poi-tree',
  templateUrl: './poi-tree.component.html',
  styleUrls: ['./poi-tree.component.scss'],
})
export class PoiTreeComponent {
  @Input() set filterKey(key: string) {
    if (key) {
      this.filterByName(this.filterKey)
    } else {
      this.clearFilter()
    }
  }

  @Input() set alreadySelectedNodes(nodes: PoiType[]) {
    if (!!nodes) {
      this.treeControl.dataNodes.map(node => {
        if (!this.checklistSelection.isSelected(node) && !!nodes.find(n => n.id === node.item.id)) {
          this.cleanSelection = [...this.cleanSelection, node]
          this.checklistSelection.select(node)
          const descendants = this.treeControl.getDescendants(node)
          this.checklistSelection.select(...descendants)
        }
      })
    }
  }

  @Output() poiTypeSelected = new EventEmitter<any>()

  // Map from flat node to nested node. This helps us finding the nested node to be modified
  flatNodeMap = new Map<PoiTypeNodeFlat, PoiTypeNode>()

  // Map from nested node to flattened node. This helps us to keep the same object for selection
  nestedNodeMap = new Map<PoiTypeNode, PoiTypeNodeFlat>()

  /** A selected parent node to be inserted */
  selectedParent: PoiTypeNodeFlat | null = null
  treeControl: FlatTreeControl<PoiTypeNodeFlat>
  treeFlattener: MatTreeFlattener<PoiTypeNode, PoiTypeNodeFlat>
  dataSource: MatTreeFlatDataSource<PoiTypeNode, PoiTypeNodeFlat>
  checklistSelection = new SelectionModel<PoiTypeNodeFlat>(true)
  cleanSelection: PoiTypeNodeFlat[] = []

  constructor(private _database: ChecklistDatabase, private clientOption: ClientOptionService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren)
    this.treeControl = new FlatTreeControl<PoiTypeNodeFlat>(this.getLevel, this.isExpandable)
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)

    this._database.dataChange.subscribe(data => {
      this.dataSource.data = data
    })
    clientOption.getHierarchyUpdateListener().subscribe(hierarchy => {
      this.alreadySelectedNodes = this.clientOption.selectedPoiTypes
    })
  }

  getLevel = (node: PoiTypeNodeFlat) => node.level
  isExpandable = (node: PoiTypeNodeFlat) => node.expandable
  getChildren = (node: PoiTypeNode): PoiTypeNode[] => node.children
  hasChild = (_: number, _nodeData: PoiTypeNodeFlat) => _nodeData.expandable
  hasNoContent = (_: number, _nodeData: PoiTypeNodeFlat) => !_nodeData.item

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: PoiTypeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node)
    const flatNode = existingNode && existingNode.item === node.item ? existingNode : new PoiTypeNodeFlat()

    flatNode.item = node.item
    flatNode.filtered = false
    flatNode.level = level
    flatNode.expandable = !!node.children

    this.flatNodeMap.set(flatNode, node)
    this.nestedNodeMap.set(node, flatNode)

    return flatNode
  }

  private filterByName(term: string): void {
    this.treeControl.dataNodes.forEach(node => (node.filtered = true))

    this.treeControl.dataNodes
      .filter(node => node.item.name.toLowerCase().includes(term.toLowerCase()))
      .forEach(node => {
        const parent = this.getParentNode(node)
        const children = this.treeControl.getDescendants(node)

        if (!!parent) {
          parent.filtered = false

          if (!!this.getParentNode(parent)) {
            const grandParent = this.getParentNode(parent)
            grandParent.filtered = false
          }
        }

        // if found item has children
        if (!!children && children.length > 0) {
          children.forEach(n => (n.filtered = false))
        }

        node.filtered = false
      })

    this.treeControl.expandAll()
  }

  private clearFilter(): void {
    this.treeControl.dataNodes.forEach(node => (node.filtered = false))
    this.treeControl.collapseAll()
  }

  // Whether all the descendants of the node are selected.
  descendantsAllSelected(node: PoiTypeNodeFlat): boolean {
    const descendants = this.treeControl.getDescendants(node)
    const descAllSelected = descendants.every(child => this.checklistSelection.isSelected(child))

    return descAllSelected
  }

  // Whether part of the descendants are selected
  descendantsPartiallySelected(node: PoiTypeNodeFlat): boolean {
    const descendants = this.treeControl.getDescendants(node)
    const result = descendants.some(child => this.checklistSelection.isSelected(child))

    return result && !this.descendantsAllSelected(node)
  }

  // Toggle the to-do item selection. Select/deselect all the descendants node
  itemSelectionToggle(node: PoiTypeNodeFlat): void {
    this.checklistSelection.toggle(node)

    const descendants = this.treeControl.getDescendants(node)
    if (!!this.getParentNode(node)) {
      const parent = this.getParentNode(node)

      const siblings = this.treeControl
        .getDescendants(parent)
        .filter(n => n.item.id.startsWith('g_'))
        .filter(n => n.item.id !== node.item.id)

      // Force update for the parent
      descendants.every(child => this.checklistSelection.isSelected(child))
      this.checkAllParentsSelection(node)

      // if it IS selected already
      if (!this.checklistSelection.isSelected(node)) {
        // if all siblings are selected
        if (siblings.every(i => this.checklistSelection.isSelected(i))) {
          // we are about to break down a parent-group, and add all siblings to the selections
          this.cleanSelection = [
            // remove the parent group, add the siblings
            ...this.cleanSelection.filter(i => i.item.id !== parent.item.id),
            ...siblings,
          ]
        } else {
          // remove it from the selection
          this.cleanSelection = this.cleanSelection
            .filter(i => i.item.id !== node.item.id)
            // also remove all descendants!
            .filter(i => !descendants.map(it => it.item.id).includes(i.item.id))
        }
        // take care of selecting all descendants
        this.checklistSelection.deselect(...descendants)
      } else {
        // if IS NOT selected, add it

        // but FIRST check if all the siblings are selected, that means
        // we should select the parent and remove all children
        if (siblings.every(i => this.checklistSelection.isSelected(i))) {
          this.cleanSelection = [
            ...this.cleanSelection
              .filter(i => !siblings.map(it => it.item.id).includes(i.item.id))
              .filter(i => i.item.id !== node.item.id),
            parent,
          ]
        } else {
          this.cleanSelection = [...this.cleanSelection, node]
        }

        this.cleanSelection = this.cleanSelection
          // also remove all descendants!
          .filter(i => !descendants.map(it => it.item.id).includes(i.item.id))

        // take care of deselecting all descendants
        this.checklistSelection.select(...descendants)
      }
    } else {
      // IF IS SELECTED, REMOVE FROM SELECTION
      if (!this.checklistSelection.isSelected(node)) {
        this.cleanSelection = this.cleanSelection.filter(i => i.item.id !== node.item.id)
        this.checklistSelection.deselect(...descendants)
      } else {
        this.cleanSelection = [
          // remove any selected child from selection
          ...this.cleanSelection.filter(i => !descendants.find(d => d.item.id === i.item.id)),
          node,
        ]
        this.checklistSelection.select(...descendants)
      }
    }

    // emit clean selection
    this.poiTypeSelected.emit(this.cleanSelection.map(i => i.item))
  }

  // Toggle a leaf to-do item selection. Check all the parents to see if they changed
  leafItemSelectionToggle(node: PoiTypeNodeFlat): void {
    this.checklistSelection.toggle(node)
    this.checkAllParentsSelection(node)

    const parent = this.getParentNode(node)
    const siblings = this.treeControl.getDescendants(parent).filter(i => i.item.id !== node.item.id)

    // if IS ALREADY selected!!
    if (!this.checklistSelection.isSelected(node)) {
      // if all siblings are selected
      if (siblings.every(i => this.checklistSelection.isSelected(i))) {
        // we are about to break down a parent-group, and add all siblings to the selections
        this.cleanSelection = [
          // remove the parent group, add the siblings
          ...this.cleanSelection.filter(i => i.item.id !== parent.item.id),
          ...siblings,
        ]
      }

      // remove it from the selection
      this.cleanSelection = this.cleanSelection.filter(i => i.item.id !== node.item.id)
    } else {
      // if IS NOT selected, add it

      // but FIRST check if all the siblings are selected, that means
      // we should select the parent and remove all children
      if (siblings.every(i => this.checklistSelection.isSelected(i))) {
        this.cleanSelection = [
          ...this.cleanSelection
            .filter(i => !siblings.map(it => it.item.id).includes(i.item.id))
            .filter(i => i.item.id !== node.item.id),
          parent,
        ]
      } else {
        this.cleanSelection = [...this.cleanSelection, node]
      }
    }

    // emit clean selection
    this.poiTypeSelected.emit(this.cleanSelection.map(i => i.item))
  }

  // Checks all the parents when a leaf node is selected/unselected
  checkAllParentsSelection(node: PoiTypeNodeFlat): void {
    let parent: PoiTypeNodeFlat | null = this.getParentNode(node)

    while (parent) {
      this.checkRootNodeSelection(parent)
      parent = this.getParentNode(parent)
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: PoiTypeNodeFlat): void {
    const nodeSelected = this.checklistSelection.isSelected(node)
    const descendants = this.treeControl.getDescendants(node)
    const descAllSelected = descendants.every(child => this.checklistSelection.isSelected(child))

    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node)
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node)
    }
  }

  // Get the parent node of a node
  getParentNode(node: PoiTypeNodeFlat): PoiTypeNodeFlat | null {
    const currentLevel = this.getLevel(node)

    if (currentLevel < 1) {
      return null
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i]

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode
      }
    }

    return null
  }
}
