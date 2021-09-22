import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PoiType } from '@targomo/core'
import { ClientOptionService } from 'services/client-option.service'

/**
 * Node for to-do item
 */
export class PoiTypeNode {
  children: PoiTypeNode[]
  item: PoiType
}

/** Flat to-do item node with expandable and level information */
export class PoiTypeNodeFlat {
  item: PoiType
  filtered: boolean
  level: number
  expandable: boolean
}

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<PoiTypeNode[]>([])
  allPoiTypes: PoiType[]

  get data(): PoiTypeNode[] {
    return this.dataChange.value
  }

  constructor(private clientOption: ClientOptionService) {
    clientOption.getHierarchyUpdateListener().subscribe(hierarchy => {
      const data = this.buildFileTree(hierarchy)
      this.dataChange.next(data)
    })
  }

  buildFileTree(poiTypes: PoiType[]): PoiTypeNode[] {
    return poiTypes.reduce<PoiTypeNode[]>((accumulator, poiType) => {
      const node = new PoiTypeNode()

      if (poiType !== null) {
        node.item = poiType

        if (
          !!poiType.contents &&
          poiType.contents.length > 0 &&
          // do not make composite_tags expandable
          node.item.type !== 'COMPOSITE_TAG'
        ) {
          node.children = this.buildFileTree(poiType.contents)
        }
      }

      return accumulator.concat(node)
    }, [])
  }
}
