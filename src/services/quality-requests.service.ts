import { Injectable } from '@angular/core'
import { EdgeWeightType, LatLngId, OSMType, PoiGroup, QualityRequestOptions, TravelMode, TravelType } from '@targomo/core'
import { client } from './global'


@Injectable({providedIn: 'root'})

export class QualityRequest {
  coreServiceUrl = 'https://api.targomo.com/britishisles/'
  // Travel options
  edgeWeight: EdgeWeightType = 'time' // Can be 'time' or 'distance'
  maxTravel = 1800 // Integer that represents meters or seconds, depending on EDGE_WEIGHT's value
  travelMode: TravelType = 'walk' // Can be 'walk', 'car', 'bike' or 'transit'
  separateScores = true
  osmTypes: (OSMType | PoiGroup)[] = [
    {
        'key': 'group',
        'value': "g_eat-out"
    },
    {
        'key': 'amenity',
        'value': "cafe"
    }
  ]

  private createRequestOptions(): QualityRequestOptions {
    let requestOptions: QualityRequestOptions = {}
    this.osmTypes.forEach(osmType => {
      requestOptions[osmType.value] = {
        type: 'poiCoverageCount',
        osmTypes: [osmType],
        maxEdgeWeight: this.maxTravel,
        edgeWeight: this.edgeWeight,
        travelMode: {[this.travelMode]: {}} as TravelMode,
        coreServiceUrl: this.coreServiceUrl
      }
    })
    
    return requestOptions
  }

  async getScores(locations: LatLngId[]) {
    let requestOptions: QualityRequestOptions = this.createRequestOptions()
    const results = await client.quality.fetch(locations, requestOptions)    
    return results.data
  }

  getPoiHierarchy(): string {
    return `
      {
         "id":"g_shop",
         "name":"Shopping",
         "description":"Places where to shop",
         "icon":"shop",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"g_food",
               "name":"Food-beverages",
               "description":"Shops with food and beverages",
               "icon":"grocery",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"supermarket",
                     "name":"Supermarket",
                     "description":"Large store for groceries and other goods",
                     "icon":"grocery",
                     "key":"shop",
                     "value":"supermarket",
                     "type":"TAG"
                  },
                  {
                     "id":"convenience",
                     "name":"Convenience shop",
                     "description":"Convenience store",
                     "icon":"convenience",
                     "key":"shop",
                     "value":"convenience",
                     "type":"TAG"
                  },
                  {
                     "id":"frozen_food",
                     "name":"Frozen food shop",
                     "description":"Shop selling frozen food",
                     "icon":"ice-cream",
                     "key":"shop",
                     "value":"frozen_food",
                     "type":"TAG"
                  },
                  {
                     "id":"general",
                     "name":"General shop",
                     "description":"Small shop selling variety of different products",
                     "icon":"grocery",
                     "key":"shop",
                     "value":"general",
                     "type":"TAG"
                  },
                  {
                     "id":"greengrocer",
                     "name":"Greengrocer",
                     "description":"Shop selling fruits and vegetables",
                     "icon":"shop",
                     "key":"shop",
                     "value":"greengrocer",
                     "type":"TAG"
                  },
                  {
                     "id":"marketplace",
                     "name":"Marketplace",
                     "description":"Marketplace where goods and services are traded daily or weekly",
                     "icon":"shop",
                     "key":"amenity",
                     "value":"marketplace",
                     "type":"TAG"
                  },
                  {
                     "id":"alcohol",
                     "name":"Alcohol shop",
                     "description":"Shop selling alcoholic drinks",
                     "icon":"alcohol-shop",
                     "key":"shop",
                     "value":"alcohol",
                     "type":"TAG"
                  },
                  {
                     "id":"bakery",
                     "name":"Bakery",
                     "description":"Shop selling bread",
                     "icon":"bakery",
                     "key":"shop",
                     "value":"bakery",
                     "type":"TAG"
                  },
                  {
                     "id":"beverages",
                     "name":"Beverages shop",
                     "description":"Shop selling alcoholic and non-alcoholic beverages",
                     "icon":"alcohol-shop",
                     "key":"shop",
                     "value":"beverages",
                     "type":"TAG"
                  },
                  {
                     "id":"brewing_supplies",
                     "name":"Brewing supplies shop",
                     "description":"Shop selling ingredients and equipment for home brewing of beer and wine",
                     "icon":"beer",
                     "key":"shop",
                     "value":"brewing_supplies",
                     "type":"TAG"
                  },
                  {
                     "id":"butcher",
                     "name":"Butchery",
                     "description":"Shop selling meat or meat products",
                     "icon":"slaughterhouse",
                     "key":"shop",
                     "value":"butcher",
                     "type":"TAG"
                  },
                  {
                     "id":"cheese",
                     "name":"Cheese shop",
                     "description":"Shop selling cheese",
                     "icon":"slaughterhouse",
                     "key":"shop",
                     "value":"cheese",
                     "type":"TAG"
                  },
                  {
                     "id":"chocolate",
                     "name":"Chocolate shop",
                     "description":"Shop selling chocolate",
                     "icon":"confectionery",
                     "key":"shop",
                     "value":"chocolate",
                     "type":"TAG"
                  },
                  {
                     "id":"coffee",
                     "name":"Coffee shop",
                     "description":"Shop selling coffee",
                     "icon":"cafe",
                     "key":"shop",
                     "value":"coffee",
                     "type":"TAG"
                  },
                  {
                     "id":"confectionery",
                     "name":"Confectionery shop",
                     "description":"Shop selling sweets and candies",
                     "icon":"confectionery",
                     "key":"shop",
                     "value":"confectionery",
                     "type":"TAG"
                  },
                  {
                     "id":"deli",
                     "name":"Deli",
                     "description":"Shop selling delicacies",
                     "icon":"confectionery",
                     "key":"shop",
                     "value":"deli",
                     "type":"TAG"
                  },
                  {
                     "id":"dairy",
                     "name":"Dairy shop",
                     "description":"Shop selling dairy products",
                     "icon":"slaughterhouse",
                     "key":"shop",
                     "value":"dairy",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_farm",
                     "name":"Farm shop",
                     "description":"Shop at a farm, selling farm produce",
                     "icon":"farm",
                     "key":"shop",
                     "value":"farm",
                     "type":"TAG"
                  },
                  {
                     "id":"health_food",
                     "name":"Health food shop",
                     "description":"Shop selling wholefoods, vitamins, nutrition supplements and meat and dairy alternatives",
                     "icon":"heart",
                     "key":"shop",
                     "value":"health_food",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_ice_cream",
                     "name":"Ice cream shop",
                     "description":"Shop selling ice cream to take home",
                     "icon":"ice-cream",
                     "key":"shop",
                     "value":"ice_cream",
                     "type":"TAG"
                  },
                  {
                     "id":"organic",
                     "name":"Organic shop",
                     "description":"Shop selling organic products",
                     "icon":"shop",
                     "clusterDefinition":[
                        [
                           "shop=*",
                           "organic=yes",
                           "match=all"
                        ],
                        [
                           "shop=*",
                           "organic=only",
                           "match=all"
                        ]
                     ],
                     "type":"TAG"
                  },
                  {
                     "id":"pasta",
                     "name":"Pasta shop",
                     "description":"Shop selling (fresh) pasta und ravioli",
                     "icon":"restaurant-noodle",
                     "key":"shop",
                     "value":"pasta",
                     "type":"TAG"
                  },
                  {
                     "id":"pastry",
                     "name":"Pastry shop",
                     "description":"Shop where sweet bakery products are produced and sold",
                     "icon":"bakery",
                     "key":"shop",
                     "value":"pastry",
                     "type":"TAG"
                  },
                  {
                     "id":"seafood",
                     "name":"Seafood shop",
                     "description":"Shop selling fish/seafood",
                     "icon":"restaurant-seafood",
                     "key":"shop",
                     "value":"seafood",
                     "type":"TAG"
                  },
                  {
                     "id":"spices",
                     "name":"Spice shop",
                     "description":"Shop selling spices",
                     "icon":null,
                     "key":"shop",
                     "value":"spices",
                     "type":"TAG"
                  },
                  {
                     "id":"tea",
                     "name":"Tea shop",
                     "description":"Shop selling tea",
                     "icon":"teahouse",
                     "key":"shop",
                     "value":"tea",
                     "type":"TAG"
                  },
                  {
                     "id":"wine",
                     "name":"Wine shop",
                     "description":"Shop selling wine",
                     "icon":"alcohol-shop",
                     "key":"shop",
                     "value":"wine",
                     "type":"TAG"
                  },
                  {
                     "id":"water",
                     "name":"Water shop",
                     "description":"Shop selling drinking water",
                     "icon":"water",
                     "key":"shop",
                     "value":"water",
                     "type":"TAG"
                  },
                  {
                     "id":"c_kiosk",
                     "name":"Kiosk",
                     "description":"Small shop on the pavement selling magazines, tobacco, newspapers, sweets and stamps",
                     "icon":"alcohol-shop",
                     "type":"COMPOSITE_TAG",
                     "contents":[
                        {
                           "id":"shop_kiosk",
                           "name":"Kiosk",
                           "description":"Small shop on the pavement selling magazines, tobacco, newspapers, sweets and stamps",
                           "icon":"alcohol-shop",
                           "key":"shop",
                           "value":"kiosk",
                           "type":"TAG"
                        },
                        {
                           "id":"building_kiosk",
                           "name":"Kiosk",
                           "description":"Small retail building",
                           "icon":"alcohol-shop",
                           "key":"building",
                           "value":"kiosk",
                           "type":"TAG"
                        }
                     ]
                  }
               ]
            },
            {
               "id":"g_department",
               "name":"Department-wholesale",
               "description":"Department and wholesale shops",
               "icon":"shop",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"department_store",
                     "name":"Department store",
                     "description":"Large store with multiple clothing and other general merchandise departments",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"department_store",
                     "type":"TAG"
                  },
                  {
                     "id":"mall",
                     "name":"Mall",
                     "description":"Group of stores, typically associated with a single building structure",
                     "icon":"shop",
                     "key":"shop",
                     "value":"mall",
                     "type":"TAG"
                  },
                  {
                     "id":"wholesale",
                     "name":"Wholesale",
                     "description":"Shop selling items in bulk",
                     "icon":"warehouse",
                     "key":"shop",
                     "value":"wholesale",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_clothing",
               "name":"Clothing-accessories",
               "description":"Shops with clothing and accessories",
               "icon":"clothing-store",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"watches",
                     "name":"Watch shop",
                     "description":"Shop selling watches",
                     "icon":"watch",
                     "key":"shop",
                     "value":"watches",
                     "type":"TAG"
                  },
                  {
                     "id":"second_hand",
                     "name":"Second hand shop",
                     "description":"Shop selling second hand goods",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"second_hand",
                     "type":"TAG"
                  },
                  {
                     "id":"bag",
                     "name":"Bag shop",
                     "description":"Shop selling bags",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"bag",
                     "type":"TAG"
                  },
                  {
                     "id":"boutique",
                     "name":"Boutique",
                     "description":"Small shop selling expensive or designer clothing and/or accessories",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"boutique",
                     "type":"TAG"
                  },
                  {
                     "id":"clothes",
                     "name":"Clothing shop",
                     "description":"Shop selling clothes",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"clothes",
                     "type":"TAG"
                  },
                  {
                     "id":"fabric",
                     "name":"Fabric shop",
                     "description":"Shop selling fabric",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"fabric",
                     "type":"TAG"
                  },
                  {
                     "id":"fashion",
                     "name":"Fashion shop",
                     "description":"Shop selling fashion",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"fashion",
                     "type":"TAG"
                  },
                  {
                     "id":"fashion_accessories",
                     "name":"Fashion accessory shop",
                     "description":"Shop selling fashion accessories",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"fashion_accessories",
                     "type":"TAG"
                  },
                  {
                     "id":"jewelry",
                     "name":"Jewelry shop",
                     "description":"Shop selling rings, necklaces, earrings and watches",
                     "icon":"jewelry-store",
                     "key":"shop",
                     "value":"jewelry",
                     "type":"TAG"
                  },
                  {
                     "id":"leather",
                     "name":"Leather goods shop",
                     "description":"Shop selling leather products",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"leather",
                     "type":"TAG"
                  },
                  {
                     "id":"sewing",
                     "name":"Sewing accessories shop",
                     "description":"Shop selling sewing supplies (fabric, thread, yarn, knitting needles, sewing machines)",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"sewing",
                     "type":"TAG"
                  },
                  {
                     "id":"shoes",
                     "name":"Shoe shop",
                     "description":"Shop selling shoes",
                     "icon":"shoe",
                     "key":"shop",
                     "value":"shoes",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_health",
               "name":"Health-beauty",
               "description":"Shops or services for health and beauty",
               "icon":"heart",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"hairdresser",
                     "name":"Hairdresser",
                     "description":"Shop where people can get their hair cut",
                     "icon":"hairdresser",
                     "key":"shop",
                     "value":"hairdresser",
                     "type":"TAG"
                  },
                  {
                     "id":"hearing_aids",
                     "name":"Hearing aids shop",
                     "description":"Shop specialized in selling hearing aids devices",
                     "icon":"music",
                     "key":"shop",
                     "value":"hearing_aids",
                     "type":"TAG"
                  },
                  {
                     "id":"herbalist",
                     "name":"Herbalist",
                     "description":"Shop selling herbs, often for medical purposes",
                     "icon":"florist",
                     "key":"shop",
                     "value":"herbalist",
                     "type":"TAG"
                  },
                  {
                     "id":"massage",
                     "name":"Massage salon",
                     "description":"Shop where people can get a massage",
                     "icon":"heart",
                     "key":"shop",
                     "value":"massage",
                     "type":"TAG"
                  },
                  {
                     "id":"medical_supply",
                     "name":"Medical supply store",
                     "description":"Shop selling medical equipment for private persons",
                     "icon":"doctor",
                     "key":"shop",
                     "value":"medical_supply",
                     "type":"TAG"
                  },
                  {
                     "id":"nutrition_supplements",
                     "name":"Nutrition supplements shop",
                     "description":"Shops selling nutritional supplements",
                     "icon":"heart",
                     "key":"shop",
                     "value":"nutrition_supplements",
                     "type":"TAG"
                  },
                  {
                     "id":"optician",
                     "name":"Optician",
                     "description":"Shop selling, fits, and repairs prescription eyeglasses and contact lenses",
                     "icon":"optician",
                     "key":"shop",
                     "value":"optician",
                     "type":"TAG"
                  },
                  {
                     "id":"perfumery",
                     "name":"Perfumery",
                     "description":"Shop selling perfumes",
                     "icon":null,
                     "key":"shop",
                     "value":"perfumery",
                     "type":"TAG"
                  },
                  {
                     "id":"tattoo",
                     "name":"Tattoo studio",
                     "description":"Shop where people can get permanent tattoos",
                     "icon":null,
                     "key":"shop",
                     "value":"tattoo",
                     "type":"TAG"
                  },
                  {
                     "id":"chemist",
                     "name":"Drugstore",
                     "description":"Shop selling articles of personal hygiene, cosmetics, and household cleaning products",
                     "icon":"defibrillator",
                     "key":"shop",
                     "value":"chemist",
                     "type":"TAG"
                  },
                  {
                     "id":"cosmetics",
                     "name":"Cosmetics shop",
                     "description":"Shop selling cosmetics",
                     "icon":"hairdresser",
                     "key":"shop",
                     "value":"cosmetics",
                     "type":"TAG"
                  },
                  {
                     "id":"beauty",
                     "name":"Beauty salon",
                     "description":"Shop selling non-hairdresser beauty services",
                     "icon":"heart",
                     "key":"shop",
                     "value":"beauty",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_interior",
               "name":"Furniture-interior",
               "description":"Home and interior shops",
               "icon":"furniture",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"appliance",
                     "name":"Home appliance shop",
                     "description":"Shop selling major appliances",
                     "icon":"laundry",
                     "key":"shop",
                     "value":"appliance",
                     "type":"TAG"
                  },
                  {
                     "id":"bathroom_furnishing",
                     "name":"Bathroom furnishing shop",
                     "description":"Shop selling bathroom furnishings",
                     "icon":"paint",
                     "key":"shop",
                     "value":"bathroom_furnishing",
                     "type":"TAG"
                  },
                  {
                     "id":"doityourself",
                     "name":"DIY store",
                     "description":"Shop selling do-it-yourself materials",
                     "icon":"hardware",
                     "key":"shop",
                     "value":"doityourself",
                     "type":"TAG"
                  },
                  {
                     "id":"electrical",
                     "name":"Electrical shop",
                     "description":"Shop selling electrical supplies and devices",
                     "icon":"laundry",
                     "key":"shop",
                     "value":"electrical",
                     "type":"TAG"
                  },
                  {
                     "id":"energy",
                     "name":"Energy shop",
                     "description":"Shop selling equipment and supplies for generating energy, such as solar panels or butane cylinders",
                     "icon":"fire-station",
                     "key":"shop",
                     "value":"energy",
                     "type":"TAG"
                  },
                  {
                     "id":"fireplace",
                     "name":"Fireplace shop",
                     "description":"Shop selling fireplaces",
                     "icon":"fire-station",
                     "key":"shop",
                     "value":"fireplace",
                     "type":"TAG"
                  },
                  {
                     "id":"garden_centre",
                     "name":"Garden centre",
                     "description":"Shop selling potted flowers, and sometimes even trees",
                     "icon":"garden-centre",
                     "key":"shop",
                     "value":"garden_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"garden_furniture",
                     "name":"Garden furniture shop",
                     "description":"Shop selling garden furniture",
                     "icon":"garden-centre",
                     "key":"shop",
                     "value":"garden_furniture",
                     "type":"TAG"
                  },
                  {
                     "id":"gas",
                     "name":"Gas shop",
                     "description":"Shop selling and/or refilling bottled gas",
                     "icon":"fire-station",
                     "key":"shop",
                     "value":"gas",
                     "type":"TAG"
                  },
                  {
                     "id":"glaziery",
                     "name":"Glazier's workshop",
                     "description":"Shop selling and installing glazing for windows and doors",
                     "icon":"home",
                     "key":"shop",
                     "value":"glaziery",
                     "type":"TAG"
                  },
                  {
                     "id":"hardware",
                     "name":"Hardware shop",
                     "description":"Shop selling timber, tools and other building products",
                     "icon":"hardware",
                     "key":"shop",
                     "value":"hardware",
                     "type":"TAG"
                  },
                  {
                     "id":"houseware",
                     "name":"Houseware shop",
                     "description":"Shop selling small household items",
                     "icon":"hardware",
                     "key":"shop",
                     "value":"houseware",
                     "type":"TAG"
                  },
                  {
                     "id":"paint",
                     "name":"Paint shop",
                     "description":"Shop selling paints",
                     "icon":"paint",
                     "key":"shop",
                     "value":"paint",
                     "type":"TAG"
                  },
                  {
                     "id":"security",
                     "name":"Security shop",
                     "description":"Shop selling security equipment",
                     "icon":"danger",
                     "key":"shop",
                     "value":"security",
                     "type":"TAG"
                  },
                  {
                     "id":"trade",
                     "name":"Building materials shop",
                     "description":"Shop selling to a particular traders, but normally also retails to normal consumers",
                     "icon":"hardware",
                     "key":"shop",
                     "value":"trade",
                     "type":"TAG"
                  },
                  {
                     "id":"antiques",
                     "name":"Antique shop",
                     "description":"Shop selling antiques",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"antiques",
                     "type":"TAG"
                  },
                  {
                     "id":"bed",
                     "name":"Bed shop",
                     "description":"Shop selling mattresses and other bedding products",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"bed",
                     "type":"TAG"
                  },
                  {
                     "id":"candles",
                     "name":"Candle shop",
                     "description":"Shop selling candles and candle accessories",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"candles",
                     "type":"TAG"
                  },
                  {
                     "id":"carpet",
                     "name":"Carpet shop",
                     "description":"Shop selling carpets",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"carpet",
                     "type":"TAG"
                  },
                  {
                     "id":"curtain",
                     "name":"Curtain shop",
                     "description":"Shop selling curtains or drapes",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"curtain",
                     "type":"TAG"
                  },
                  {
                     "id":"doors",
                     "name":"Doorsshop",
                     "description":"Shop selling doors",
                     "icon":"home",
                     "key":"shop",
                     "value":"doors",
                     "type":"TAG"
                  },
                  {
                     "id":"flooring",
                     "name":"Flooring shop",
                     "description":"Shop selling a variety of floorings",
                     "icon":"paint",
                     "key":"shop",
                     "value":"flooring",
                     "type":"TAG"
                  },
                  {
                     "id":"furniture",
                     "name":"Furniture shop",
                     "description":"Shop selling furniture",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"furniture",
                     "type":"TAG"
                  },
                  {
                     "id":"interior_decoration",
                     "name":"Interior decoration shop",
                     "description":"Shop selling interior decorations",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"interior_decoration",
                     "type":"TAG"
                  },
                  {
                     "id":"kitchen",
                     "name":"Kitchen studio",
                     "description":"Shop where you can plan and buy your kitchen",
                     "icon":"paint",
                     "key":"shop",
                     "value":"kitchen",
                     "type":"TAG"
                  },
                  {
                     "id":"lamps",
                     "name":"Lamp shop",
                     "description":"Shop selling lamps",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"lamps",
                     "type":"TAG"
                  },
                  {
                     "id":"tiles",
                     "name":"Tile shop",
                     "description":"Shop selling tiles",
                     "icon":"home",
                     "key":"shop",
                     "value":"tiles",
                     "type":"TAG"
                  },
                  {
                     "id":"window_blind",
                     "name":"Window blind shop",
                     "description":"Shop selling window blinds",
                     "icon":"home",
                     "key":"shop",
                     "value":"window_blind",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_swimming_pool",
                     "name":"Pool shop",
                     "description":"Shop selling swimming pool equipment and supplies",
                     "icon":"swimming",
                     "key":"shop",
                     "value":"swimming_pool",
                     "type":"TAG"
                  },
                  {
                     "id":"frame",
                     "name":"Frame shop",
                     "description":"Shop selling frames",
                     "icon":"art-gallery",
                     "key":"shop",
                     "value":"frame",
                     "type":"TAG"
                  },
                  {
                     "id":"storage_rental",
                     "name":"Storage rental",
                     "description":"Storage of household goods",
                     "icon":"warehouse",
                     "key":"shop",
                     "value":"storage_rental",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_electro",
               "name":"Electronics",
               "description":"Electronics shops",
               "icon":"mobile-phone",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"computer",
                     "name":"Computer shop",
                     "description":"Shop selling computers, peripherals and software",
                     "icon":null,
                     "key":"shop",
                     "value":"computer",
                     "type":"TAG"
                  },
                  {
                     "id":"robot",
                     "name":"Robot shop",
                     "description":"Shop selling robots and/or related accessories and services",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"robot",
                     "type":"TAG"
                  },
                  {
                     "id":"electronics",
                     "name":"Electronics shop",
                     "description":"Shop selling consumer electronics such as TVs, radios and fridges",
                     "icon":"laundry",
                     "key":"shop",
                     "value":"electronics",
                     "type":"TAG"
                  },
                  {
                     "id":"hifi",
                     "name":"Hifi shop",
                     "description":"Shop selling high fidelity audio components",
                     "icon":"music",
                     "key":"shop",
                     "value":"hifi",
                     "type":"TAG"
                  },
                  {
                     "id":"mobile_phone",
                     "name":"Mobile phone shop",
                     "description":"Shop selling mobile phones and accessories",
                     "icon":"mobile-phone",
                     "key":"shop",
                     "value":"mobile_phone",
                     "type":"TAG"
                  },
                  {
                     "id":"camera",
                     "name":"Camera shop",
                     "description":"Shop selling cameras and lenses",
                     "icon":"attraction",
                     "key":"shop",
                     "value":"camera",
                     "type":"TAG"
                  },
                  {
                     "id":"radiotechnics",
                     "name":"Radiotechnics shop",
                     "description":"Shop selling electronic components, electrical products, radio measuring devices, supplies for radio and electronics",
                     "icon":"communications-tower",
                     "key":"shop",
                     "value":"radiotechnics",
                     "type":"TAG"
                  },
                  {
                     "id":"vacuum_cleaner",
                     "name":"Vacuum cleaner shop",
                     "description":"Shop selling vacuum cleaners",
                     "icon":"home",
                     "key":"shop",
                     "value":"vacuum_cleaner",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_outdoor",
               "name":"Outdoor-sports",
               "description":"Shops with accessories for sports and outdoor",
               "icon":"pitch",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"shop_fishing",
                     "name":"Fishing shop",
                     "description":"Shop selling fishing equipment",
                     "icon":"aquarium",
                     "key":"shop",
                     "value":"fishing",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_free_flying",
                     "name":"Free flying shop",
                     "description":"Shop selling free flying equipment",
                     "icon":"mountain",
                     "key":"shop",
                     "value":"free_flying",
                     "type":"TAG"
                  },
                  {
                     "id":"hunting",
                     "name":"Hunting shop",
                     "description":"Shop selling gun and hunting equipment",
                     "icon":"park-alt1",
                     "key":"shop",
                     "value":"hunting",
                     "type":"TAG"
                  },
                  {
                     "id":"outdoor",
                     "name":"Outdoor shop",
                     "description":"Shop selling trekking, climbing, camping equipment",
                     "icon":"natural",
                     "key":"shop",
                     "value":"outdoor",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_scuba_diving",
                     "name":"Scuba diving shop",
                     "description":"Shop selling equipment for scuba diving and/or related accessories and services",
                     "icon":"aquarium",
                     "key":"shop",
                     "value":"scuba_diving",
                     "type":"TAG"
                  },
                  {
                     "id":"ski",
                     "name":"Ski shop",
                     "description":"Shop selling skis and/or related accessories and services",
                     "icon":"skiing",
                     "key":"shop",
                     "value":"ski",
                     "type":"TAG"
                  },
                  {
                     "id":"sports",
                     "name":"Sports shop",
                     "description":"Shop selling sports equipment and clothing",
                     "icon":"pitch",
                     "key":"shop",
                     "value":"sports",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_other",
               "name":"Other",
               "description":"Other shops",
               "icon":"shop",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"travel_agency",
                     "name":"Travel agency",
                     "description":"Shop selling travel related products and services",
                     "icon":"globe",
                     "key":"shop",
                     "value":"travel_agency",
                     "type":"TAG"
                  },
                  {
                     "id":"variety_store",
                     "name":"Variety store",
                     "description":"Shop selling inexpensive items",
                     "icon":"shop",
                     "key":"shop",
                     "value":"variety_store",
                     "type":"TAG"
                  },
                  {
                     "id":"gift",
                     "name":"Gift shop",
                     "description":"Shop selling gifts, greeting cards souvenirs",
                     "icon":"gift",
                     "key":"shop",
                     "value":"gift",
                     "type":"TAG"
                  },
                  {
                     "id":"newsagent",
                     "name":"Newsagent",
                     "description":"Shop selling newspapers and magazines",
                     "icon":"library",
                     "key":"shop",
                     "value":"newsagent",
                     "type":"TAG"
                  },
                  {
                     "id":"stationery",
                     "name":"Stationery shop",
                     "description":"Shop selling office supplies",
                     "icon":"furniture",
                     "key":"shop",
                     "value":"stationery",
                     "type":"TAG"
                  },
                  {
                     "id":"lottery",
                     "name":"Lottery shop",
                     "description":"Shop selling lottery tickets",
                     "icon":"casino",
                     "key":"shop",
                     "value":"lottery",
                     "type":"TAG"
                  },
                  {
                     "id":"art",
                     "name":"Art shop",
                     "description":"Shop selling works of art",
                     "icon":"art-gallery",
                     "key":"shop",
                     "value":"art",
                     "type":"TAG"
                  },
                  {
                     "id":"collector",
                     "name":"Collector shop",
                     "description":"Shop selling collectors items, like stamps, coins, action figures",
                     "icon":"gift",
                     "key":"shop",
                     "value":"collector",
                     "type":"TAG"
                  },
                  {
                     "id":"music",
                     "name":"Music shop",
                     "description":"Store selling recorded music (vinyl/CDs)",
                     "icon":"music",
                     "key":"shop",
                     "value":"music",
                     "type":"TAG"
                  },
                  {
                     "id":"musical_instrument",
                     "name":"Instrument shop",
                     "description":"Shop selling musical instruments, lyrics, scores",
                     "icon":"music",
                     "key":"shop",
                     "value":"musical_instrument",
                     "type":"TAG"
                  },
                  {
                     "id":"model",
                     "name":"Model making shop",
                     "description":"Shop selling scale models",
                     "icon":"town",
                     "key":"shop",
                     "value":"model",
                     "type":"TAG"
                  },
                  {
                     "id":"photo",
                     "name":"Photo shop",
                     "description":"Shop dealing with photos or video in any way",
                     "icon":"attraction",
                     "key":"shop",
                     "value":"photo",
                     "type":"TAG"
                  },
                  {
                     "id":"trophy",
                     "name":"Trophy shop",
                     "description":"Shop selling trophies, awards, plaques, medals",
                     "icon":"star",
                     "key":"shop",
                     "value":"trophy",
                     "type":"TAG"
                  },
                  {
                     "id":"anime",
                     "name":"Anime shop",
                     "description":"Shop selling anime and related items",
                     "icon":"rocket",
                     "key":"shop",
                     "value":"anime",
                     "type":"TAG"
                  },
                  {
                     "id":"books",
                     "name":"Book shop",
                     "description":"Shop selling books",
                     "icon":"library",
                     "key":"shop",
                     "value":"books",
                     "type":"TAG"
                  },
                  {
                     "id":"toys",
                     "name":"Game shop",
                     "description":"Shop selling childrens toys",
                     "icon":"rocket",
                     "key":"shop",
                     "value":"toys",
                     "type":"TAG"
                  },
                  {
                     "id":"games",
                     "name":"Board game shop",
                     "description":"Shop selling board games",
                     "icon":"casino",
                     "key":"shop",
                     "value":"games",
                     "type":"TAG"
                  },
                  {
                     "id":"video_games",
                     "name":"Video game shop",
                     "description":"Shop selling video games",
                     "icon":"gaming",
                     "key":"shop",
                     "value":"video_games",
                     "type":"TAG"
                  },
                  {
                     "id":"agrarian",
                     "name":"Agricultural shop ",
                     "description":"Shop selling products for agricultural use, such as pesticides, seeds and animal feed",
                     "icon":"garden-centre",
                     "key":"shop",
                     "value":"agrarian",
                     "type":"TAG"
                  },
                  {
                     "id":"florist",
                     "name":"Flower shop",
                     "description":"Shop selling bouquets of flowers",
                     "icon":"florist",
                     "key":"shop",
                     "value":"florist",
                     "type":"TAG"
                  },
                  {
                     "id":"craft",
                     "name":"Art and craft supply shop",
                     "description":"Shop selling arts and crafts supply",
                     "icon":"paint",
                     "key":"shop",
                     "value":"craft",
                     "type":"TAG"
                  },
                  {
                     "id":"locksmith",
                     "name":"Locksmith",
                     "description":"Shop where you can get keys cut",
                     "icon":"hardware",
                     "key":"shop",
                     "value":"locksmith",
                     "type":"TAG"
                  },
                  {
                     "id":"copyshop",
                     "name":"Copyshop",
                     "description":"Shop selling photocopying and printing services",
                     "icon":"library",
                     "key":"shop",
                     "value":"copyshop",
                     "type":"TAG"
                  },
                  {
                     "id":"ticket",
                     "name":"Ticket office",
                     "description":"Shop selling tickets for concerts, events and public transport",
                     "icon":"karaoke",
                     "key":"shop",
                     "value":"ticket",
                     "type":"TAG"
                  },
                  {
                     "id":"bookmaker",
                     "name":"Bookmaker",
                     "description":"Shop that takes bets on sporting and other events at agreed upon odds",
                     "icon":"soccer",
                     "key":"shop",
                     "value":"bookmaker",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_charity",
                     "name":"Social department shop",
                     "description":"Shop operated by a charity",
                     "icon":"heart",
                     "key":"shop",
                     "value":"charity",
                     "type":"TAG"
                  },
                  {
                     "id":"tailor",
                     "name":"Tailoring",
                     "description":"Shop where clothing is made, repaired, or altered professionally",
                     "icon":"clothing-store",
                     "key":"shop",
                     "value":"tailor",
                     "type":"TAG"
                  },
                  {
                     "id":"erotic",
                     "name":"Erotic shop",
                     "description":"Shop selling products such as sex toys, erotic lingerie, safe sex products, erotic games and gifts, and pornographic films and magazines",
                     "icon":null,
                     "key":"shop",
                     "value":"erotic",
                     "type":"TAG"
                  },
                  {
                     "id":"vacant",
                     "name":"Vacant",
                     "description":"Shop that is currently not being used",
                     "icon":"commercial",
                     "key":"shop",
                     "value":"vacant",
                     "type":"TAG"
                  },
                  {
                     "id":"weapons",
                     "name":"Arms shop",
                     "description":"Shop selling weapons like knifes and guns",
                     "icon":"danger",
                     "key":"shop",
                     "value":"weapons",
                     "type":"TAG"
                  },
                  {
                     "id":"shop_religion",
                     "name":"Religion",
                     "description":"Shop selling merchandise related to religion",
                     "icon":"place-of-worship",
                     "key":"shop",
                     "value":"religion",
                     "type":"TAG"
                  },
                  {
                     "id":"e-cigarette",
                     "name":"E-cigarette shop",
                     "description":"Shop selling electronic cigarettes",
                     "icon":null,
                     "key":"shop",
                     "value":"e-cigarette",
                     "type":"TAG"
                  },
                  {
                     "id":"funeral_directors",
                     "name":"Funeral directors",
                     "description":"Shop providing services related to funeral arrangements",
                     "icon":null,
                     "key":"shop",
                     "value":"funeral_directors",
                     "type":"TAG"
                  },
                  {
                     "id":"laundry",
                     "name":"Laundry",
                     "description":"Shop to get your normal clothes washed",
                     "icon":"laundry",
                     "key":"shop",
                     "value":"laundry",
                     "type":"TAG"
                  },
                  {
                     "id":"dry_cleaning",
                     "name":"Dry cleaning shop",
                     "description":"Shop or kiosk offering a clothes dry cleaning service",
                     "icon":"laundry",
                     "key":"shop",
                     "value":"dry_cleaning",
                     "type":"TAG"
                  },
                  {
                     "id":"party",
                     "name":"Party shop",
                     "description":"Shop selling party supplies like decorations, invitations and costumes",
                     "icon":"bar",
                     "key":"shop",
                     "value":"party",
                     "type":"TAG"
                  },
                  {
                     "id":"pawnbroker",
                     "name":"Pawnbroker",
                     "description":"Shop that offers secured loans against items of personal property as collateral",
                     "icon":"bank",
                     "key":"shop",
                     "value":"pawnbroker",
                     "type":"TAG"
                  },
                  {
                     "id":"pet",
                     "name":"Pet shop",
                     "description":"Shop selling pets and/or pet supplies",
                     "icon":"veterinary",
                     "key":"shop",
                     "value":"pet",
                     "type":"TAG"
                  },
                  {
                     "id":"pyrotechnics",
                     "name":"Pyrotechnics shop",
                     "description":"Shop selling consumer pyrotechnics",
                     "icon":"fire-station",
                     "key":"shop",
                     "value":"pyrotechnics",
                     "type":"TAG"
                  },
                  {
                     "id":"video",
                     "name":"Video shop",
                     "description":"Shop selling or renting out videos/DVDs",
                     "icon":"cinema",
                     "key":"shop",
                     "value":"video",
                     "type":"TAG"
                  },
                  {
                     "id":"tobacco",
                     "name":"Tobacco shop",
                     "description":"Shop selling tobacco and possibly other convenience items",
                     "icon":null,
                     "key":"shop",
                     "value":"tobacco",
                     "type":"TAG"
                  },
                  {
                     "id":"cannabis",
                     "name":"Cannabis shop",
                     "description":"Shop primarily and legally selling cannabis products",
                     "icon":null,
                     "key":"shop",
                     "value":"cannabis",
                     "type":"TAG"
                  },
                  {
                     "id":"hairdresser_supply",
                     "name":"Hairdressing supply shop",
                     "description":"Shop selling hairdressing supplies",
                     "icon":"hairdresser",
                     "key":"shop",
                     "value":"hairdresser_supply",
                     "type":"TAG"
                  }
               ]
            }
         ]
      },
      {
         "id":"g_transport",
         "name":"Public Transport",
         "description":"Transportation stops, airports, etc.",
         "icon":"bus",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"bus_stop",
               "name":"Bus stop",
               "description":"Place where public buses stop",
               "icon":"bus",
               "key":"highway",
               "value":"bus_stop",
               "type":"TAG"
            },
            {
               "id":"railway_station",
               "name":"Train station",
               "description":"Place where public trains stop",
               "icon":"rail",
               "key":"railway",
               "value":"station",
               "type":"TAG"
            },
            {
               "id":"subway_entrance",
               "name":"Subway entrance",
               "description":"The entrance point of a subway",
               "icon":"entrance",
               "key":"railway",
               "value":"subway_entrance",
               "type":"TAG"
            },
            {
               "id":"tram_stop",
               "name":"Tram stop",
               "description":"Place where a passenger can embark / disembark a tram",
               "icon":"rail-light",
               "key":"railway",
               "value":"tram_stop",
               "type":"TAG"
            },
            {
               "id":"terminal",
               "name":"Airport terminal",
               "description":"Airport passenger building",
               "icon":"airport",
               "key":"aeroway",
               "value":"terminal",
               "type":"TAG"
            },
            {
               "id":"bus_station",
               "name":"Bus station",
               "description":"Terminus where many routes stop / start, and where you can change between routes",
               "icon":"bus",
               "key":"amenity",
               "value":"bus_station",
               "type":"TAG"
            },
            {
               "id":"public_transport_station",
               "name":"Public transit station",
               "description":"Station is an area designed to access public transport",
               "icon":"ranger-station",
               "key":"public_transport",
               "value":"station",
               "type":"TAG"
            },
            {
               "id":"stop_position",
               "name":"Public transit stop",
               "description":"The position on the street or rails where a public transport vehicle stops",
               "icon":"rail-metro",
               "key":"public_transport",
               "value":"stop_position",
               "type":"TAG"
            },
            {
               "id":"taxi",
               "name":"Taxi stand",
               "description":"Place where taxis wait for passengers",
               "icon":"car",
               "key":"amenity",
               "value":"taxi",
               "type":"TAG"
            }
         ]
      },
      {
         "id":"g_lodging",
         "name":"Accommodation",
         "description":"Lodging such as hotels, hostels, etc.",
         "icon":"lodging",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"alpine_hut",
               "name":"Alpine hut",
               "description":"Remote building located in the mountains intended to provide board and lodging",
               "icon":"mountain",
               "key":"tourism",
               "value":"alpine_hut",
               "type":"TAG"
            },
            {
               "id":"apartment",
               "name":"Apartment",
               "description":"Furnished apartment or flat with cooking and bathroom facilities that can be rented for holiday vacations",
               "icon":"home",
               "key":"tourism",
               "value":"apartment",
               "type":"TAG"
            },
            {
               "id":"chalet",
               "name":"Chalet",
               "description":"Holiday cottage with self-contained cooking and bathroom facilities",
               "icon":"home",
               "key":"tourism",
               "value":"chalet",
               "type":"TAG"
            },
            {
               "id":"camp_site",
               "name":"Camp site",
               "description":"Area where people can camp overnight using tents, camper vans or caravans",
               "icon":"campsite",
               "key":"tourism",
               "value":"camp_site",
               "type":"TAG"
            },
            {
               "id":"caravan_site",
               "name":"Caravan site",
               "description":"Place where you can stay in a caravan overnight or for longer periods",
               "icon":"campsite",
               "key":"tourism",
               "value":"caravan_site",
               "type":"TAG"
            },
            {
               "id":"guest_house",
               "name":"Guest house",
               "description":"Accommodation without hotel license that is typically owner-operated",
               "icon":"home",
               "key":"tourism",
               "value":"guest_house",
               "type":"TAG"
            },
            {
               "id":"hostel",
               "name":"Hostel",
               "description":"Cheap accommodation with shared bedrooms",
               "icon":"lodging",
               "key":"tourism",
               "value":"hostel",
               "type":"TAG"
            },
            {
               "id":"motel",
               "name":"Motel",
               "description":"Short term accommodation, particularly for people travelling by car",
               "icon":"lodging",
               "key":"tourism",
               "value":"motel",
               "type":"TAG"
            },
            {
               "id":"wilderness_hut",
               "name":"Wilderness hut",
               "description":"Remote building, with a fireplace, intended to provide temporary shelter and sleeping accommodation",
               "icon":"shelter",
               "key":"tourism",
               "value":"wilderness_hut",
               "type":"TAG"
            },
            {
               "id":"c_hotel",
               "name":"Hotel",
               "description":"Establishment that provides paid lodging",
               "icon":"lodging",
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"tourism_hotel",
                     "name":"Hotel",
                     "description":"Establishment that provides paid lodging",
                     "icon":"lodging",
                     "key":"tourism",
                     "value":"hotel",
                     "type":"TAG"
                  },
                  {
                     "id":"building_hotel",
                     "name":"Hotel building",
                     "description":"Building designed with separate rooms available for overnight accommodation",
                     "icon":"lodging",
                     "key":"building",
                     "value":"hotel",
                     "type":"TAG"
                  }
               ]
            }
         ]
      },
      {
         "id":"g_eat-out",
         "name":"Gastronomy",
         "description":"Restaurants and other places for eating out",
         "icon":"restaurant",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"fast_food",
               "name":"Fast food",
               "description":"Place concentrating on very fast counter-only service and take-away food",
               "icon":"fast-food",
               "key":"amenity",
               "value":"fast_food",
               "type":"TAG"
            },
            {
               "id":"food_court",
               "name":"Food court",
               "description":"Place with sit-down facilities shared by multiple self-service food vendors",
               "icon":"restaurant",
               "key":"amenity",
               "value":"food_court",
               "type":"TAG"
            },
            {
               "id":"restaurant",
               "name":"Restaurant",
               "description":"Place selling full sit-down meals with servers",
               "icon":"restaurant",
               "key":"amenity",
               "value":"restaurant",
               "type":"TAG"
            }
         ]
      },
      {
         "id":"g_leisure",
         "name":"Leisure",
         "description":"Places for leisure such as recreation, sport and going-out locations",
         "icon":"rocket",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"g_going_out",
               "name":"Going-out",
               "description":"Cafes and night life",
               "icon":"bar",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"cafe",
                     "name":"Cafe",
                     "description":"Place with sit-down facilities selling beverages and light meals and/or snacks",
                     "icon":"cafe",
                     "key":"amenity",
                     "value":"cafe",
                     "type":"TAG"
                  },
                  {
                     "id":"coffee_shop",
                     "name":"Coffee shop",
                     "description":"Location most known for its coffee",
                     "icon":"cafe",
                     "key":"cuisine",
                     "value":"coffee_shop",
                     "type":"TAG"
                  },
                  {
                     "id":"bar",
                     "name":"Bar",
                     "description":"Establishment selling alcoholic drinks to be consumed on the premises",
                     "icon":"bar",
                     "key":"amenity",
                     "value":"bar",
                     "type":"TAG"
                  },
                  {
                     "id":"biergarten",
                     "name":"Biergarten",
                     "description":"Open-air area where beer is served and you are allowed to bring your own food",
                     "icon":"beer",
                     "key":"amenity",
                     "value":"biergarten",
                     "type":"TAG"
                  },
                  {
                     "id":"amenity_ice_cream",
                     "name":"Ice cream",
                     "description":"Place selling ice cream and frozen yoghurt over the counter",
                     "icon":"ice-cream",
                     "key":"amenity",
                     "value":"ice_cream",
                     "type":"TAG"
                  },
                  {
                     "id":"pub",
                     "name":"Pub",
                     "description":"Establishment in the hotel and catering sector in which drinks or food are sold for immediate consumption",
                     "icon":"beer",
                     "key":"amenity",
                     "value":"pub",
                     "type":"TAG"
                  },
                  {
                     "id":"casino",
                     "name":"Casino",
                     "description":"Gambling venue with at least one table game",
                     "icon":"casino",
                     "key":"amenity",
                     "value":"casino",
                     "type":"TAG"
                  },
                  {
                     "id":"cinema",
                     "name":"Cinema",
                     "description":"Movie theater, a place showing movies",
                     "icon":"cinema",
                     "key":"amenity",
                     "value":"cinema",
                     "type":"TAG"
                  },
                  {
                     "id":"gambling",
                     "name":"Gambling",
                     "description":"Place for gambling, not being a bookmaker, lottery shop, casino, or adult gaming centre",
                     "icon":"casino",
                     "key":"amenity",
                     "value":"gambling",
                     "type":"TAG"
                  },
                  {
                     "id":"nightclub",
                     "name":"Nightclub",
                     "description":"Place to dance and drink at night",
                     "icon":"music",
                     "key":"amenity",
                     "value":"nightclub",
                     "type":"TAG"
                  },
                  {
                     "id":"brothel",
                     "name":"Brothel",
                     "description":"Establishment specifically dedicated to prostitution",
                     "icon":null,
                     "key":"amenity",
                     "value":"brothel",
                     "type":"TAG"
                  },
                  {
                     "id":"stripclub",
                     "name":"Stripclub",
                     "description":"Place that offer striptease and lap dances",
                     "icon":null,
                     "key":"amenity",
                     "value":"stripclub",
                     "type":"TAG"
                  },
                  {
                     "id":"swingerclub",
                     "name":"Swingerclub",
                     "description":"Place where adult people meet to have a party and group sex",
                     "icon":null,
                     "key":"amenity",
                     "value":"swingerclub",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_recreate",
               "name":"Recreation",
               "description":"Daytime recreation: Parks, cultural and art institutions",
               "icon":"attraction",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"museum",
                     "name":"Museum",
                     "description":"Institution with exhibitions on scientific, historical, cultural topics",
                     "icon":"museum",
                     "key":"tourism",
                     "value":"museum",
                     "type":"TAG"
                  },
                  {
                     "id":"picnic_site",
                     "name":"Picnic site",
                     "description":"Locality that is suitable for outdoors eating, with facilities to aid a picnic such as tables and benches",
                     "icon":"picnic-site",
                     "key":"tourism",
                     "value":"picnic_site",
                     "type":"TAG"
                  },
                  {
                     "id":"bbq",
                     "name":"Bbq",
                     "description":"Permanently built place for having a BBQ",
                     "icon":"bbq",
                     "key":"amenity",
                     "value":"bbq",
                     "type":"TAG"
                  },
                  {
                     "id":"theme_park",
                     "name":"Theme park",
                     "description":"Amusement park where entertainment is provided by rides, games, concessions",
                     "icon":"amusement-park",
                     "key":"tourism",
                     "value":"theme_park",
                     "type":"TAG"
                  },
                  {
                     "id":"viewpoint",
                     "name":"Viewpoint",
                     "description":"Place worth visiting, often high, with a good view of surrounding countryside or notable buildings",
                     "icon":"viewpoint",
                     "key":"tourism",
                     "value":"viewpoint",
                     "type":"TAG"
                  },
                  {
                     "id":"zoo",
                     "name":"Zoo",
                     "description":"Facility with living animals for public viewing",
                     "icon":"zoo",
                     "key":"tourism",
                     "value":"zoo",
                     "type":"TAG"
                  },
                  {
                     "id":"aquarium",
                     "name":"Aquarium",
                     "description":"Facility with living aquatic animals for public viewing",
                     "icon":"aquarium",
                     "key":"tourism",
                     "value":"aquarium",
                     "type":"TAG"
                  },
                  {
                     "id":"artwork",
                     "name":"Artwork",
                     "description":"Public piece of art",
                     "icon":"art-gallery",
                     "key":"tourism",
                     "value":"artwork",
                     "type":"TAG"
                  },
                  {
                     "id":"attraction",
                     "name":"Attraction",
                     "description":"Object of interest for a tourist",
                     "icon":"attraction",
                     "key":"tourism",
                     "value":"attraction",
                     "type":"TAG"
                  },
                  {
                     "id":"gallery",
                     "name":"Gallery",
                     "description":"Area or building that displays a variety of visual art exhibitions",
                     "icon":"art-gallery",
                     "key":"tourism",
                     "value":"gallery",
                     "type":"TAG"
                  },
                  {
                     "id":"arts_centre",
                     "name":"Arts centre",
                     "description":"Venue where a variety of arts are performed or conducted",
                     "icon":"art-gallery",
                     "key":"amenity",
                     "value":"arts_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"community_centre",
                     "name":"Community centre",
                     "description":"Place mostly used for local events, festivities and group activities",
                     "icon":"music",
                     "key":"amenity",
                     "value":"community_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"planetarium",
                     "name":"Planetarium",
                     "description":"Theatre built for presenting educational and entertaining shows about astronomy and the night sky",
                     "icon":"globe",
                     "key":"amenity",
                     "value":"planetarium",
                     "type":"TAG"
                  },
                  {
                     "id":"public_bookcase",
                     "name":"Public bookcase",
                     "description":"Street shelf containing books",
                     "icon":"library",
                     "key":"amenity",
                     "value":"public_bookcase",
                     "type":"TAG"
                  },
                  {
                     "id":"social_centre",
                     "name":"Social centre",
                     "description":"Centre of fraternities, sororities, professional societies, union halls and other nonprofit organization",
                     "icon":"recycling",
                     "key":"amenity",
                     "value":"social_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"theatre",
                     "name":"Theatre",
                     "description":"Place where live theatrical performances are held",
                     "icon":"theatre",
                     "key":"amenity",
                     "value":"theatre",
                     "type":"TAG"
                  },
                  {
                     "id":"photo_booth",
                     "name":"Photo booth",
                     "description":"Stand to create instant photos",
                     "icon":"attraction",
                     "key":"amenity",
                     "value":"photo_booth",
                     "type":"TAG"
                  },
                  {
                     "id":"dance",
                     "name":"Dance Hall",
                     "description":"Dance venue or dance hall",
                     "icon":"music",
                     "key":"leisure",
                     "value":"dance",
                     "type":"TAG"
                  },
                  {
                     "id":"escape_game",
                     "name":"Escape game",
                     "description":"Physical adventure game in which players solve a series of puzzles using clues, hints and strategy",
                     "icon":"entrance-alt1",
                     "key":"leisure",
                     "value":"escape_game",
                     "type":"TAG"
                  },
                  {
                     "id":"garden",
                     "name":"Garden",
                     "description":"Place where flowers and other plants are grown in a decorative and structured manner or for scientific purposes",
                     "icon":"garden",
                     "key":"leisure",
                     "value":"garden",
                     "type":"TAG"
                  },
                  {
                     "id":"leisure_park",
                     "name":"Park",
                     "description":"Urban, public green space used for recreation",
                     "icon":"park",
                     "key":"leisure",
                     "value":"park",
                     "type":"TAG"
                  },
                  {
                     "id":"amenity_swimming_pool",
                     "name":"Swimming pool",
                     "description":"Place built for swimming as a recreational activity or sport",
                     "icon":"swimming",
                     "key":"amenity",
                     "value":"swimming_pool",
                     "type":"TAG"
                  },
                  {
                     "id":"beach",
                     "name":"Beach",
                     "description":"Unvegetated strip of sand, shingle or other loose material at the coast or the shore of a lake",
                     "icon":"beach",
                     "key":"natural",
                     "value":"beach",
                     "type":"TAG"
                  },
                  {
                     "id":"leisure_fishing",
                     "name":"Fishing zone",
                     "description":"Public place for fishing",
                     "icon":"aquarium",
                     "key":"leisure",
                     "value":"fishing",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_sport",
               "name":"Sport",
               "description":"Places to play sport",
               "icon":"pitch",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"ice_rink",
                     "name":"Ice rink",
                     "description":"Place where you can skate and play bandy or ice hockey",
                     "icon":null,
                     "key":"leisure",
                     "value":"ice_rink",
                     "type":"TAG"
                  },
                  {
                     "id":"pitch",
                     "name":"Pitch",
                     "description":"Area designed for practising a particular sport, normally designated with appropriate markings",
                     "icon":"pitch",
                     "key":"leisure",
                     "value":"pitch",
                     "type":"TAG"
                  },
                  {
                     "id":"swimming_area",
                     "name":"Swimming area",
                     "description":"Official open-space natural place where you can swim",
                     "icon":"swimming",
                     "key":"leisure",
                     "value":"swimming_area",
                     "type":"TAG"
                  },
                  {
                     "id":"playground",
                     "name":"Playground",
                     "description":"Area designed for children to play",
                     "icon":"playground",
                     "key":"leisure",
                     "value":"playground",
                     "type":"TAG"
                  },
                  {
                     "id":"leisure_swimming_pool",
                     "name":"Swimming pool",
                     "description":"Place built for swimming as a recreational activity or sport",
                     "icon":"swimming",
                     "key":"leisure",
                     "value":"swimming_pool",
                     "type":"TAG"
                  },
                  {
                     "id":"sports_centre",
                     "name":"Sports centre",
                     "description":"Distinct facility where sports take place within an enclosed area",
                     "icon":"pitch",
                     "key":"leisure",
                     "value":"sports_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"sport",
                     "name":"Sport",
                     "description":"Club for the purpose of playing or supporting one or more sports",
                     "icon":"pitch",
                     "key":"club",
                     "value":"sport",
                     "type":"TAG"
                  },
                  {
                     "id":"yoga",
                     "name":"Yoga",
                     "description":"Yoga as exercise",
                     "icon":null,
                     "key":"sport",
                     "value":"yoga",
                     "type":"TAG"
                  },
                  {
                     "id":"fitness_centre",
                     "name":"Fitness centre",
                     "description":"Health club or gym with exercise machines, fitness classes or both",
                     "icon":"fitness-centre",
                     "key":"leisure",
                     "value":"fitness_centre",
                     "type":"TAG"
                  },
                  {
                     "id":"fitness_station",
                     "name":"Fitness station",
                     "description":"Outdoor facility where people can practise typical fitness excercises",
                     "icon":"fitness-centre",
                     "key":"leisure",
                     "value":"fitness_station",
                     "type":"TAG"
                  },
                  {
                     "id":"stadium",
                     "name":"Stadium",
                     "description":"Building which was built as stadium",
                     "icon":"stadium",
                     "key":"building",
                     "value":"stadium",
                     "type":"TAG"
                  },
                  {
                     "id":"sports_hall",
                     "name":"Sports hall",
                     "description":"Building that was built as a sports hall",
                     "icon":"pitch",
                     "key":"building",
                     "value":"sports_hall",
                     "type":"TAG"
                  },
                  {
                     "id":"soccer",
                     "name":"Soccer",
                     "description":"Team sport played between two teams of eleven players",
                     "icon":"soccer",
                     "key":"sport",
                     "value":"soccer",
                     "type":"TAG"
                  },
                  {
                     "id":"tennis",
                     "name":"Tennis",
                     "description":"Sport in which two or four players hit a ball back and forth using a tennis racket",
                     "icon":"tennis",
                     "key":"sport",
                     "value":"tennis",
                     "type":"TAG"
                  },
                  {
                     "id":"basketball",
                     "name":"Basketball",
                     "description":"Sport played by two teams of five players on a rectangular court",
                     "icon":"basketball",
                     "key":"sport",
                     "value":"basketball",
                     "type":"TAG"
                  },
                  {
                     "id":"baseball",
                     "name":"Baseball",
                     "description":"Bat-and-ball game played between two teams of nine players on a field each who take turns batting and fielding",
                     "icon":"baseball",
                     "key":"sport",
                     "value":"baseball",
                     "type":"TAG"
                  },
                  {
                     "id":"multi",
                     "name":"Multi",
                     "description":"Sports facility that is suitable for more than one sport",
                     "icon":"pitch",
                     "key":"sport",
                     "value":"multi",
                     "type":"TAG"
                  },
                  {
                     "id":"swimming",
                     "name":"Swimming",
                     "description":"Place where people do swimming",
                     "icon":"swimming",
                     "key":"sport",
                     "value":"swimming",
                     "type":"TAG"
                  },
                  {
                     "id":"golf",
                     "name":"Golf",
                     "description":"Club-and-ball sport in which players use various clubs to hit balls into a series of holes on a course in as few strokes as possible",
                     "icon":"golf",
                     "key":"sport",
                     "value":"golf",
                     "type":"TAG"
                  },
                  {
                     "id":"equestrian",
                     "name":"Equestrian",
                     "description":"Sport practised with the horse as a partner",
                     "icon":"horse-riding",
                     "key":"sport",
                     "value":"equestrian",
                     "type":"TAG"
                  },
                  {
                     "id":"athletics",
                     "name":"Athletics",
                     "description":"Collection of sports which combines various athletic contests based on the skills of running, jumping, and throwing",
                     "icon":"pitch",
                     "key":"sport",
                     "value":"athletics",
                     "type":"TAG"
                  },
                  {
                     "id":"running",
                     "name":"Running",
                     "description":"Features dedicated to the sport of running",
                     "icon":"pitch",
                     "key":"sport",
                     "value":"running",
                     "type":"TAG"
                  },
                  {
                     "id":"volleyball",
                     "name":"Volleyball",
                     "description":"Team sport in which two teams of six players are separated by a net",
                     "icon":"volleyball",
                     "key":"sport",
                     "value":"volleyball",
                     "type":"TAG"
                  },
                  {
                     "id":"beachvolleyball",
                     "name":"Beachvolleyball",
                     "description":"Team sport played by two teams of two players on a sand court divided by a net",
                     "icon":"volleyball",
                     "key":"sport",
                     "value":"beachvolleyball",
                     "type":"TAG"
                  },
                  {
                     "id":"skateboard",
                     "name":"Skateboard",
                     "description":"Area designated and equipped for skateboarding",
                     "icon":"skateboard",
                     "key":"sport",
                     "value":"skateboard",
                     "type":"TAG"
                  },
                  {
                     "id":"american_football",
                     "name":"American football",
                     "description":"Sport played by two teams of eleven players on a rectangular field with goalposts at each end",
                     "icon":"american-football",
                     "key":"sport",
                     "value":"american_football",
                     "type":"TAG"
                  },
                  {
                     "id":"climbing",
                     "name":"Climbing",
                     "description":"Natural climbing sites or artificial climbs",
                     "icon":"mountain",
                     "key":"sport",
                     "value":"climbing",
                     "type":"TAG"
                  },
                  {
                     "id":"boules",
                     "name":"Boules",
                     "description":"Group of games in which the objective is to throw or roll heavy balls as close as possible to a small target ball",
                     "icon":null,
                     "key":"sport",
                     "value":"boules",
                     "type":"TAG"
                  },
                  {
                     "id":"fitness",
                     "name":"Fitness",
                     "description":"Fitness sports",
                     "icon":"fitness-centre",
                     "key":"sport",
                     "value":"fitness",
                     "type":"TAG"
                  },
                  {
                     "id":"bowls",
                     "name":"Bowls",
                     "description":"Place where you can play lawn bowls/lawn bowling",
                     "icon":"bowling-alley",
                     "key":"sport",
                     "value":"bowls",
                     "type":"TAG"
                  },
                  {
                     "id":"table_tennis",
                     "name":"Table tennis",
                     "description":"Bat and ball game played over a table",
                     "icon":"table-tennis",
                     "key":"sport",
                     "value":"table_tennis",
                     "type":"TAG"
                  },
                  {
                     "id":"shooting",
                     "name":"Shooting",
                     "description":"Competitive and leisure sport involving tests of proficiency using various types of weapons such as firearms and airguns",
                     "icon":null,
                     "key":"sport",
                     "value":"shooting",
                     "type":"TAG"
                  },
                  {
                     "id":"cricket",
                     "name":"Cricket",
                     "description":"Bat-and-ball sport contested by two teams, usually of eleven players, each on a large grass Cricket pitch",
                     "icon":"cricket",
                     "key":"sport",
                     "value":"cricket",
                     "type":"TAG"
                  },
                  {
                     "id":"motor",
                     "name":"Motor",
                     "description":"Sport with motorised vehicles, e.g. auto racing or motorcycle racing",
                     "icon":null,
                     "key":"sport",
                     "value":"motor",
                     "type":"TAG"
                  },
                  {
                     "id":"netball",
                     "name":"Netball",
                     "description":"Hand ball competition between two teams on a rectangular court",
                     "icon":null,
                     "key":"sport",
                     "value":"netball",
                     "type":"TAG"
                  },
                  {
                     "id":"skiing",
                     "name":"Skiing",
                     "description":"Suitable place for skiers",
                     "icon":"skiing",
                     "key":"sport",
                     "value":"skiing",
                     "type":"TAG"
                  },
                  {
                     "id":"gymnastics",
                     "name":"Gymnastics",
                     "description":"Involves agile people in lycra doing flips and summersaults on a mat",
                     "icon":null,
                     "key":"sport",
                     "value":"gymnastics",
                     "type":"TAG"
                  },
                  {
                     "id":"rugby_union",
                     "name":"Rugby union",
                     "description":"Full contact team sport that originated in England in the first half of the 19th century",
                     "icon":"american-football",
                     "key":"sport",
                     "value":"rugby_union",
                     "type":"TAG"
                  },
                  {
                     "id":"hockey",
                     "name":"Hockey",
                     "description":"Sport in which two teams play against each other by trying to manoeuvre a ball or a puck into the opponent's goal using a hockey stick",
                     "icon":null,
                     "key":"sport",
                     "value":"hockey",
                     "type":"TAG"
                  },
                  {
                     "id":"horse_racing",
                     "name":"Horse racing",
                     "description":"Equestrian sport and major international industry",
                     "icon":"horse-riding",
                     "key":"sport",
                     "value":"horse_racing",
                     "type":"TAG"
                  },
                  {
                     "id":"sport_free_flying",
                     "name":"Free flying",
                     "description":"Suitable place for paragliders (paragliders) and hang gliders (hang-gliders)",
                     "icon":"mountain",
                     "key":"sport",
                     "value":"free_flying",
                     "type":"TAG"
                  },
                  {
                     "id":"handball",
                     "name":"Handball",
                     "description":"Team sport in which two teams of seven players each pass a ball to throw it into the goal of the other team",
                     "icon":null,
                     "key":"sport",
                     "value":"handball",
                     "type":"TAG"
                  },
                  {
                     "id":"football",
                     "name":"Football",
                     "description":"Team sports that involve, to varying degrees, kicking a ball to score a goal",
                     "icon":"soccer",
                     "key":"sport",
                     "value":"football",
                     "type":"TAG"
                  },
                  {
                     "id":"canoe",
                     "name":"Canoe",
                     "description":"Activity which involves paddling a canoe with a single-bladed paddle",
                     "icon":null,
                     "key":"sport",
                     "value":"canoe",
                     "type":"TAG"
                  },
                  {
                     "id":"sport_scuba_diving",
                     "name":"Scuba diving",
                     "description":"Place or area where you can do scuba diving",
                     "icon":"aquarium",
                     "key":"sport",
                     "value":"scuba_diving",
                     "type":"TAG"
                  },
                  {
                     "id":"motocross",
                     "name":"Motocross",
                     "description":"Motorcycle racing on unpaved surfaces",
                     "icon":null,
                     "key":"sport",
                     "value":"motocross",
                     "type":"TAG"
                  },
                  {
                     "id":"karting",
                     "name":"Karting",
                     "description":"Variant of open-wheel motorsport with small, open, four-wheeled vehicles called karts",
                     "icon":null,
                     "key":"sport",
                     "value":"karting",
                     "type":"TAG"
                  },
                  {
                     "id":"cycling",
                     "name":"Cycling",
                     "description":"The use of bicycles for sport",
                     "icon":"bicycle",
                     "key":"sport",
                     "value":"cycling",
                     "type":"TAG"
                  },
                  {
                     "id":"ice_hockey",
                     "name":"Ice hockey",
                     "description":"Team sport played on ice in which two teams use sticks to shoot a hard rubber hockey puck into their opponent's net",
                     "icon":null,
                     "key":"sport",
                     "value":"ice_hockey",
                     "type":"TAG"
                  },
                  {
                     "id":"archery",
                     "name":"Archery",
                     "description":"The art, practice, or skill of propelling arrows with the use of a bow",
                     "icon":null,
                     "key":"sport",
                     "value":"archery",
                     "type":"TAG"
                  },
                  {
                     "id":"field_hockey",
                     "name":"Field hockey",
                     "description":"Team sport of the hockey family",
                     "icon":null,
                     "key":"sport",
                     "value":"field_hockey",
                     "type":"TAG"
                  },
                  {
                     "id":"padel",
                     "name":"Padel",
                     "description":"Padel is a racquet sport invented in 1969 in Acapulco, Mexico",
                     "icon":null,
                     "key":"sport",
                     "value":"padel",
                     "type":"TAG"
                  },
                  {
                     "id":"badminton",
                     "name":"Badminton",
                     "description":"Racquet game played by singles or in teams of two",
                     "icon":"tennis",
                     "key":"sport",
                     "value":"badminton",
                     "type":"TAG"
                  },
                  {
                     "id":"exercise",
                     "name":"Exercise",
                     "description":"Bodily activity that enhances or maintains physical fitness and overall health and wellness",
                     "icon":"fitness-centre",
                     "key":"sport",
                     "value":"exercise",
                     "type":"TAG"
                  },
                  {
                     "id":"chess",
                     "name":"Chess",
                     "description":"Popular two-player strategy board game",
                     "icon":null,
                     "key":"sport",
                     "value":"chess",
                     "type":"TAG"
                  },
                  {
                     "id":"futsal",
                     "name":"Futsal",
                     "description":"Ball sport played mainly on a indoors hard court",
                     "icon":"soccer",
                     "key":"sport",
                     "value":"futsal",
                     "type":"TAG"
                  },
                  {
                     "id":"gaelic_games",
                     "name":"Gaelic games",
                     "description":"Traditional sports played in Ireland",
                     "icon":null,
                     "key":"sport",
                     "value":"gaelic_games",
                     "type":"TAG"
                  },
                  {
                     "id":"rugby",
                     "name":"Rugby",
                     "description":"Rugby pitch used for Rugby",
                     "icon":"american-football",
                     "key":"sport",
                     "value":"rugby",
                     "type":"TAG"
                  },
                  {
                     "id":"skating",
                     "name":"Skating",
                     "description":"Action sport which involves riding and performing tricks using a skateboard",
                     "icon":null,
                     "key":"sport",
                     "value":"skating",
                     "type":"TAG"
                  },
                  {
                     "id":"softball",
                     "name":"Softball",
                     "description":"Bat-and-ball game similar to baseball",
                     "icon":null,
                     "key":"sport",
                     "value":"softball",
                     "type":"TAG"
                  },
                  {
                     "id":"model_aerodrome",
                     "name":"Model aerodrome",
                     "description":"Place where you can fly your remotely controlled (RC) planes, helicopters and the like",
                     "icon":null,
                     "key":"sport",
                     "value":"model_aerodrome",
                     "type":"TAG"
                  },
                  {
                     "id":"bmx",
                     "name":"Bmx",
                     "description":"Cycle sport performed on BMX bikes",
                     "icon":"bicycle",
                     "key":"sport",
                     "value":"bmx",
                     "type":"TAG"
                  },
                  {
                     "id":"team_handball",
                     "name":"Team handball",
                     "description":"Team sport played with goals and a thrown ball using the hands",
                     "icon":null,
                     "key":"sport",
                     "value":"team_handball",
                     "type":"TAG"
                  },
                  {
                     "id":"rugby_league",
                     "name":"Rugby league",
                     "description":"Rugby pitch used for Rugby league football",
                     "icon":"american-football",
                     "key":"sport",
                     "value":"rugby_league",
                     "type":"TAG"
                  },
                  {
                     "id":"billiards",
                     "name":"Billiards",
                     "description":"Wide variety of games of skill generally played with a cue stick which is used to strike billiard balls",
                     "icon":null,
                     "key":"sport",
                     "value":"billiards",
                     "type":"TAG"
                  },
                  {
                     "id":"ice_skating",
                     "name":"Ice skating",
                     "description":"Sport moving on ice while using ice skates",
                     "icon":null,
                     "key":"sport",
                     "value":"ice_skating",
                     "type":"TAG"
                  },
                  {
                     "id":"trampoline",
                     "name":"Trampoline",
                     "description":"Sport that is carried out on large trampolines indoor or outdoors",
                     "icon":null,
                     "key":"sport",
                     "value":"trampoline",
                     "type":"TAG"
                  },
                  {
                     "id":"cricket_nets",
                     "name":"Cricket nets",
                     "description":"Used by batsmen and bowlers to practice their cricketing techniques",
                     "icon":"cricket",
                     "key":"sport",
                     "value":"cricket_nets",
                     "type":"TAG"
                  },
                  {
                     "id":"rowing",
                     "name":"Rowing",
                     "description":"Sites connected to the sport of rowing",
                     "icon":null,
                     "key":"sport",
                     "value":"rowing",
                     "type":"TAG"
                  },
                  {
                     "id":"australian_football",
                     "name":"Australian football",
                     "description":"Game played between two teams of eighteen players on an Australian football ground, also called Aussie rules or AFL",
                     "icon":"american-football",
                     "key":"sport",
                     "value":"australian_football",
                     "type":"TAG"
                  },
                  {
                     "id":"sailing",
                     "name":"Sailing",
                     "description":"Propulsion of a vehicle and the control of its movement with large foils called sails",
                     "icon":null,
                     "key":"sport",
                     "value":"sailing",
                     "type":"TAG"
                  },
                  {
                     "id":"racquet",
                     "name":"Racquet",
                     "description":"Racquetball facilities, such as racquetball courts",
                     "icon":"tennis",
                     "key":"sport",
                     "value":"racquet",
                     "type":"TAG"
                  },
                  {
                     "id":"disc_golf",
                     "name":"Disc golf",
                     "description":"Flying disc game, as well as a precision and accuracy sport, in which individual players throw a flying disc at a target",
                     "icon":null,
                     "key":"sport",
                     "value":"disc_golf",
                     "type":"TAG"
                  },
                  {
                     "id":"climbing_adventure",
                     "name":"Climbing adventure",
                     "description":"Sport where people get mountain hiking accessories and try to climb on prebuilt wires and other objects high above on the trees",
                     "icon":"mountain",
                     "key":"sport",
                     "value":"climbing_adventure",
                     "type":"TAG"
                  },
                  {
                     "id":"ice_stock",
                     "name":"Ice stock",
                     "description":"Ice stock sport, also known as Bavarian curling, is a winter sport, somewhat similar to curling",
                     "icon":null,
                     "key":"sport",
                     "value":"ice_stock",
                     "type":"TAG"
                  },
                  {
                     "id":"roller_skating",
                     "name":"Roller skating",
                     "description":"Traveling on surfaces with roller skates",
                     "icon":null,
                     "key":"sport",
                     "value":"roller_skating",
                     "type":"TAG"
                  },
                  {
                     "id":"horseshoes",
                     "name":"Horseshoes",
                     "description":"Lawn game played between two people using four horseshoes and two throwing targets set in a lawn or sandbox area",
                     "icon":null,
                     "key":"sport",
                     "value":"horseshoes",
                     "type":"TAG"
                  },
                  {
                     "id":"long_jump",
                     "name":"Long jump",
                     "description":"Athletic discipline in which athletes attempt to leap as far as possible from a take off point",
                     "icon":null,
                     "key":"sport",
                     "value":"long_jump",
                     "type":"TAG"
                  },
                  {
                     "id":"bullfighting",
                     "name":"Bullfighting",
                     "description":"Spectacle in which bulls are fought by humans",
                     "icon":"slaughterhouse",
                     "key":"sport",
                     "value":"bullfighting",
                     "type":"TAG"
                  },
                  {
                     "id":"ski_jumping",
                     "name":"Ski jumping",
                     "description":"Winter sport in which competitors aim to achieve the longest jump after descending from a specially designed ramp on their skis",
                     "icon":"skiing",
                     "key":"sport",
                     "value":"ski_jumping",
                     "type":"TAG"
                  },
                  {
                     "id":"sport_fishing",
                     "name":"Fishing",
                     "description":"Activity of trying to catch fish",
                     "icon":"aquarium",
                     "key":"sport",
                     "value":"fishing",
                     "type":"TAG"
                  },
                  {
                     "id":"paintball",
                     "name":"Paintball",
                     "description":"Game in which players mark their opponents with colored paint capsules shot out of an air gun",
                     "icon":null,
                     "key":"sport",
                     "value":"paintball",
                     "type":"TAG"
                  },
                  {
                     "id":"toboggan",
                     "name":"Toboggan",
                     "description":"Public toboggan run",
                     "icon":null,
                     "key":"sport",
                     "value":"toboggan",
                     "type":"TAG"
                  },
                  {
                     "id":"boxing",
                     "name":"Boxing",
                     "description":"Combat sport in which two people engage in a contest of strength, speed, reflexes, endurance, and will",
                     "icon":null,
                     "key":"sport",
                     "value":"boxing",
                     "type":"TAG"
                  },
                  {
                     "id":"martial_arts",
                     "name":"Martial arts",
                     "description":"Codified systems and traditions of combat",
                     "icon":null,
                     "key":"sport",
                     "value":"martial_arts",
                     "type":"TAG"
                  },
                  {
                     "id":"surfing",
                     "name":"Surfing",
                     "description":"Spot for surfing",
                     "icon":null,
                     "key":"sport",
                     "value":"surfing",
                     "type":"TAG"
                  },
                  {
                     "id":"orienteering",
                     "name":"Orienteering",
                     "description":"Sport that requires to navigate in unfamiliar terrain",
                     "icon":null,
                     "key":"sport",
                     "value":"orienteering",
                     "type":"TAG"
                  },
                  {
                     "id":"rc_car",
                     "name":"Rc car",
                     "description":"Radio controlled cars",
                     "icon":null,
                     "key":"sport",
                     "value":"rc_car",
                     "type":"TAG"
                  },
                  {
                     "id":"korfball",
                     "name":"Korfball",
                     "description":"Sport played by two teams similar to basketball and netball",
                     "icon":null,
                     "key":"sport",
                     "value":"korfball",
                     "type":"TAG"
                  },
                  {
                     "id":"squash",
                     "name":"Squash",
                     "description":"Racket and ball sport played by two or four players in a four-walled court with a small, hollow rubber ball",
                     "icon":null,
                     "key":"sport",
                     "value":"squash",
                     "type":"TAG"
                  },
                  {
                     "id":"ultralight_aviation",
                     "name":"Ultralight aviation",
                     "description":"The flying of lightweight, 1- or 2-seat fixed-wing aircraft",
                     "icon":null,
                     "key":"sport",
                     "value":"ultralight_aviation",
                     "type":"TAG"
                  },
                  {
                     "id":"shuffleboard",
                     "name":"Shuffleboard",
                     "description":"Game in which players use cues to push weighted discs, sending them gliding down a narrow court",
                     "icon":null,
                     "key":"sport",
                     "value":"shuffleboard",
                     "type":"TAG"
                  },
                  {
                     "id":"dog_racing",
                     "name":"Dog racing",
                     "description":"Place used for dog racing",
                     "icon":"dog-park",
                     "key":"sport",
                     "value":"dog_racing",
                     "type":"TAG"
                  },
                  {
                     "id":"paddle_tennis",
                     "name":"Paddle tennis",
                     "description":"Racquet sport adapted from tennis and played for over a century",
                     "icon":"tennis",
                     "key":"sport",
                     "value":"paddle_tennis",
                     "type":"TAG"
                  },
                  {
                     "id":"dog_training",
                     "name":"Dog training",
                     "description":"Place where you can train with a dog",
                     "icon":"dog-park",
                     "key":"sport",
                     "value":"dog_training",
                     "type":"TAG"
                  },
                  {
                     "id":"lacrosse",
                     "name":"Lacrosse",
                     "description":"Team sport played with a lacrosse stick and a lacrosse ball",
                     "icon":null,
                     "key":"sport",
                     "value":"lacrosse",
                     "type":"TAG"
                  },
                  {
                     "id":"car_racing",
                     "name":"Car racing",
                     "description":"Motorsport involving the racing of automobiles for competition",
                     "icon":null,
                     "key":"sport",
                     "value":"car_racing",
                     "type":"TAG"
                  },
                  {
                     "id":"shooting_range",
                     "name":"Shooting range",
                     "description":"Competitive and leisure sport involving tests of proficiency using various types of weapons such as firearms and airguns",
                     "icon":null,
                     "key":"sport",
                     "value":"shooting_range",
                     "type":"TAG"
                  },
                  {
                     "id":"karate",
                     "name":"Karate",
                     "description":"Martial art developed in the Ryukyu Kingdom",
                     "icon":null,
                     "key":"sport",
                     "value":"karate",
                     "type":"TAG"
                  },
                  {
                     "id":"petanque",
                     "name":"Petanque",
                     "description":"Falls into the category of boules sports",
                     "icon":null,
                     "key":"sport",
                     "value":"petanque",
                     "type":"TAG"
                  },
                  {
                     "id":"judo",
                     "name":"Judo",
                     "description":"Judo (\"gentle way\") is a modern martial art, combat and Olympic sport created in Japan in 1882 by Jigoro Kano",
                     "icon":null,
                     "key":"sport",
                     "value":"judo",
                     "type":"TAG"
                  },
                  {
                     "id":"croquet",
                     "name":"Croquet",
                     "description":"Game that is played between two or more players embedded on a small grass playing court or pitch which involves hitting plastic or wooden balls with a mallet through hoops",
                     "icon":null,
                     "key":"sport",
                     "value":"croquet",
                     "type":"TAG"
                  },
                  {
                     "id":"curling",
                     "name":"Curling",
                     "description":"Sport in which players slide stones on a sheet of ice towards a target area which is segmented into four concentric rings",
                     "icon":null,
                     "key":"sport",
                     "value":"curling",
                     "type":"TAG"
                  },
                  {
                     "id":"water_ski",
                     "name":"Water ski",
                     "description":"Sport in which an individual is pulled behind a boat or a cable ski installation over a body of water, skimming the surface on one or two skis",
                     "icon":"skiing",
                     "key":"sport",
                     "value":"water_ski",
                     "type":"TAG"
                  },
                  {
                     "id":"horse_riding",
                     "name":"Horse riding",
                     "description":"The use of horses for practical working purposes, transportation, recreational activities, artistic or cultural exercises, and competitive sport",
                     "icon":"horse-riding",
                     "key":"sport",
                     "value":"horse_riding",
                     "type":"TAG"
                  },
                  {
                     "id":"c_bowling",
                     "name":"Bowling",
                     "description":"Bowling center",
                     "icon":"bowling-alley",
                     "type":"COMPOSITE_TAG",
                     "contents":[
                        {
                           "id":"10pin",
                           "name":"10pin",
                           "description":"Bowling game popular in North America with 10 pins",
                           "icon":"bowling-alley",
                           "key":"sport",
                           "value":"10pin",
                           "type":"TAG"
                        },
                        {
                           "id":"9pin",
                           "name":"9pin",
                           "description":"Bowling game played in Europe with only 9 pins",
                           "icon":"bowling-alley",
                           "key":"sport",
                           "value":"9pin",
                           "type":"TAG"
                        }
                     ]
                  },
                  {
                     "id":"c_miniature_golf",
                     "name":"Miniature golf",
                     "description":"Place or area where you can play miniature golf",
                     "icon":"golf",
                     "type":"COMPOSITE_TAG",
                     "contents":[
                        {
                           "id":"leisure_miniature_golf",
                           "name":"Miniature golf",
                           "description":"Place or area where you can play miniature golf",
                           "icon":"golf",
                           "key":"leisure",
                           "value":"miniature_golf",
                           "type":"TAG"
                        },
                        {
                           "id":"sport_miniature_golf",
                           "name":"Miniature golf",
                           "description":"Place or area where you can play miniature golf",
                           "icon":"golf",
                           "key":"sport",
                           "value":"miniature_golf",
                           "type":"TAG"
                        }
                     ]
                  }
               ]
            }
         ]
      },
      {
         "id":"g_service",
         "name":"Services",
         "description":"Services: Public, health, financial, education..",
         "icon":"town-hall",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"g_healthcare",
               "name":"Healthcare",
               "description":"Health-related places such as hospitals and pharmacies",
               "icon":"hospital-JP",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"pharmacy",
                     "name":"Pharmacy",
                     "description":"Shop where a pharmacist sells medications",
                     "icon":"pharmacy",
                     "key":"amenity",
                     "value":"pharmacy",
                     "type":"TAG"
                  },
                  {
                     "id":"hospital",
                     "name":"Hospital",
                     "description":"Hospital providing in-patient medical treatment",
                     "icon":"hospital",
                     "key":"amenity",
                     "value":"hospital",
                     "type":"TAG"
                  },
                  {
                     "id":"doctors",
                     "name":"Doctors",
                     "description":"Place to get medical attention or a check up from a physician",
                     "icon":"doctor",
                     "key":"amenity",
                     "value":"doctors",
                     "type":"TAG"
                  },
                  {
                     "id":"dentist",
                     "name":"Dentist",
                     "description":"Place where you can get dental care or a dental examination",
                     "icon":"dentist",
                     "key":"amenity",
                     "value":"dentist",
                     "type":"TAG"
                  },
                  {
                     "id":"clinic",
                     "name":"Clinic",
                     "description":"Medium-sized medical centre, typically without admission of inpatients",
                     "icon":"hospital",
                     "key":"amenity",
                     "value":"clinic",
                     "type":"TAG"
                  },
                  {
                     "id":"social_facility",
                     "name":"Social facility",
                     "description":"Facility that provides social services",
                     "icon":"wheelchair",
                     "key":"amenity",
                     "value":"social_facility",
                     "type":"TAG"
                  },
                  {
                     "id":"baby_hatch",
                     "name":"Baby hatch",
                     "description":"Place where mothers can bring their newborn babies and leave them anonymously in a safe place",
                     "icon":null,
                     "key":"amenity",
                     "value":"baby_hatch",
                     "type":"TAG"
                  },
                  {
                     "id":"nursing_home",
                     "name":"Nursing home",
                     "description":"Home for disabled/elderly persons who need permanent care",
                     "icon":"hospital-JP",
                     "key":"amenity",
                     "value":"nursing_home",
                     "type":"TAG"
                  },
                  {
                     "id":"veterinary",
                     "name":"Veterinary",
                     "description":"Place that deals with the prevention, diagnosis and treatment of disease in animals",
                     "icon":"veterinary",
                     "key":"amenity",
                     "value":"veterinary",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_education",
               "name":"Education",
               "description":"Education-related places such as schools, universities, etc.",
               "icon":"college",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"kindergarten",
                     "name":"Kindergarten",
                     "description":"Place for looking after preschool children and giving early education",
                     "icon":"school",
                     "key":"amenity",
                     "value":"kindergarten",
                     "type":"TAG"
                  },
                  {
                     "id":"amenity_school",
                     "name":"School",
                     "description":"Primary or secondary school (pupils typically aged 6 to 18)",
                     "icon":"school",
                     "key":"amenity",
                     "value":"school",
                     "type":"TAG"
                  },
                  {
                     "id":"college",
                     "name":"College",
                     "description":"Place for further education, usually a post-secondary education institution",
                     "icon":"college",
                     "key":"amenity",
                     "value":"college",
                     "type":"TAG"
                  },
                  {
                     "id":"university",
                     "name":"University",
                     "description":"Educational institution designed for instruction, examination, or both, of students in many branches of advanced learning",
                     "icon":"college",
                     "key":"amenity",
                     "value":"university",
                     "type":"TAG"
                  },
                  {
                     "id":"language_school",
                     "name":"Language school",
                     "description":"Educational institution where one studies a foreign language",
                     "icon":"school",
                     "key":"amenity",
                     "value":"language_school",
                     "type":"TAG"
                  },
                  {
                     "id":"library",
                     "name":"Library",
                     "description":"Place to read and/or lend books",
                     "icon":"library",
                     "key":"amenity",
                     "value":"library",
                     "type":"TAG"
                  },
                  {
                     "id":"childcare",
                     "name":"Childcare",
                     "description":"Place where children of different ages are looked after",
                     "icon":"school",
                     "key":"amenity",
                     "value":"childcare",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"g_public",
               "name":"Public-services",
               "description":"Public toilets, post office, police station etc.",
               "icon":"information",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"post_box",
                     "name":"Post box",
                     "description":"Box to deposit outgoing postal items",
                     "icon":"post",
                     "key":"amenity",
                     "value":"post_box",
                     "type":"TAG"
                  },
                  {
                     "id":"post_office",
                     "name":"Post office",
                     "description":"Place where letters and parcels may be sent or collected",
                     "icon":"post",
                     "key":"amenity",
                     "value":"post_office",
                     "type":"TAG"
                  },
                  {
                     "id":"drinking_water",
                     "name":"Drinking water",
                     "description":"Drinking water source provides potable water for consumption",
                     "icon":"drinking-water",
                     "key":"amenity",
                     "value":"drinking_water",
                     "type":"TAG"
                  },
                  {
                     "id":"fire_station",
                     "name":"Fire station",
                     "description":"Station from which a fire brigade operates",
                     "icon":"fire-station",
                     "key":"amenity",
                     "value":"fire_station",
                     "type":"TAG"
                  },
                  {
                     "id":"police",
                     "name":"Police station",
                     "description":"Building which police officers patrol from and that is a first point of contact for civilians",
                     "icon":"police",
                     "key":"amenity",
                     "value":"police",
                     "type":"TAG"
                  },
                  {
                     "id":"post_depot",
                     "name":"Post depot",
                     "description":"Distribution centre or sorting office for letters and parcels",
                     "icon":"post",
                     "key":"amenity",
                     "value":"post_depot",
                     "type":"TAG"
                  },
                  {
                     "id":"telephone",
                     "name":"Telephone",
                     "description":"Public telephone",
                     "icon":"telephone",
                     "key":"amenity",
                     "value":"telephone",
                     "type":"TAG"
                  },
                  {
                     "id":"vending_machine",
                     "name":"Vending machine",
                     "description":"Vending machine sells food, drinks, tickets or other goods automatically",
                     "icon":"confectionery",
                     "key":"amenity",
                     "value":"vending_machine",
                     "type":"TAG"
                  },
                  {
                     "id":"information",
                     "name":"Information",
                     "description":"Information for tourists and visitors",
                     "icon":"information",
                     "key":"tourism",
                     "value":"information",
                     "type":"TAG"
                  },
                  {
                     "id":"c_toilet",
                     "name":"Toilets",
                     "description":"Publicly accessible toilets",
                     "icon":"toilet",
                     "type":"COMPOSITE_TAG",
                     "contents":[
                        {
                           "id":"toilets",
                           "name":"Toilets",
                           "description":"Publicly accessible toilets",
                           "icon":"toilet",
                           "key":"amenity",
                           "value":"toilets",
                           "type":"TAG"
                        },
                        {
                           "id":"toilet",
                           "name":"Toilet",
                           "description":"Publicly accessible toilet",
                           "icon":"toilet",
                           "key":"amenity",
                           "value":"toilet",
                           "type":"TAG"
                        }
                     ]
                  }
               ]
            },
            {
               "id":"g_finance",
               "name":"Financial",
               "description":"Banks and ATMs",
               "icon":"bank",
               "type":"CATEGORY",
               "contents":[
                  {
                     "id":"atm",
                     "name":"ATM",
                     "description":"Device that provides the clients of a financial institution with access to financial transactions",
                     "icon":"bank",
                     "key":"amenity",
                     "value":"atm",
                     "type":"TAG"
                  },
                  {
                     "id":"bank",
                     "name":"Bank",
                     "description":"Financial establishment where customers can, among other services, deposit money and take loans",
                     "icon":"bank",
                     "key":"amenity",
                     "value":"bank",
                     "type":"TAG"
                  },
                  {
                     "id":"money_lender",
                     "name":"Money lender",
                     "description":"Shop offering small personal loans at high rates of interest",
                     "icon":"bank",
                     "key":"shop",
                     "value":"money_lender",
                     "type":"TAG"
                  },
                  {
                     "id":"bureau_de_change",
                     "name":"Bureau de change",
                     "description":"Office that exchanges foreign currency and travellers cheques",
                     "icon":"bank-JP",
                     "key":"amenity",
                     "value":"bureau_de_change",
                     "type":"TAG"
                  }
               ]
            }
         ]
      },
      {
         "id":"g_landmark",
         "name":"Landmarks",
         "description":"Historic landmarks and other places for tourists",
         "icon":"landmark",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"cathedral",
               "name":"Cathedral",
               "description":"Building that was built as a cathedral",
               "icon":"religious-christian",
               "key":"building",
               "value":"cathedral",
               "type":"TAG"
            },
            {
               "id":"mosque",
               "name":"Mosque",
               "description":"Building that was built as a mosque",
               "icon":"religious-muslim",
               "key":"building",
               "value":"mosque",
               "type":"TAG"
            },
            {
               "id":"religious",
               "name":"Religious",
               "description":"Building that was built as a religious building",
               "icon":"place-of-worship",
               "key":"building",
               "value":"religious",
               "type":"TAG"
            },
            {
               "id":"shrine",
               "name":"Shrine",
               "description":"Building that was built as a shrine",
               "icon":"religious-shinto",
               "key":"building",
               "value":"shrine",
               "type":"TAG"
            },
            {
               "id":"synagogue",
               "name":"Synagogue",
               "description":"Building that was built as a synagogue",
               "icon":"religious-jewish",
               "key":"building",
               "value":"synagogue",
               "type":"TAG"
            },
            {
               "id":"temple",
               "name":"Temple",
               "description":"Building that was built as a temple",
               "icon":"place-of-worship",
               "key":"building",
               "value":"temple",
               "type":"TAG"
            },
            {
               "id":"memorial",
               "name":"Memorial",
               "description":"Small memorials, usually remembering special persons, people who lost their lives in the wars, past events or missing places",
               "icon":"monument",
               "key":"historic",
               "value":"memorial",
               "type":"TAG"
            },
            {
               "id":"wayside_cross",
               "name":"Wayside cross",
               "description":"Historical cross, symbol of christian faith",
               "icon":"religious-christian",
               "key":"historic",
               "value":"wayside_cross",
               "type":"TAG"
            },
            {
               "id":"ruins",
               "name":"Ruins",
               "description":"Remains of structures that were once complete, but have fallen into partial or complete disrepair",
               "icon":"castle",
               "key":"historic",
               "value":"ruins",
               "type":"TAG"
            },
            {
               "id":"archaeological_site",
               "name":"Archaeological site",
               "description":"Place in which evidence of past activity is preserved",
               "icon":"landmark",
               "key":"historic",
               "value":"archaeological_site",
               "type":"TAG"
            },
            {
               "id":"wayside_shrine",
               "name":"Wayside shrine",
               "description":"Historical shrine often showing a religious depiction",
               "icon":"religious-shinto",
               "key":"historic",
               "value":"wayside_shrine",
               "type":"TAG"
            },
            {
               "id":"monument",
               "name":"Monument",
               "description":"Memorial object, which is especially large, built to remember, show respect to a person or group of people or to commemorate an event",
               "icon":"monument",
               "key":"historic",
               "value":"monument",
               "type":"TAG"
            },
            {
               "id":"building",
               "name":"Building",
               "description":"Non-specific historically significant building",
               "icon":"building",
               "key":"historic",
               "value":"building",
               "type":"TAG"
            },
            {
               "id":"castle",
               "name":"Castle",
               "description":"Used for various kinds of castles, palaces, fortresses, manors, stately homes, kremlins, shiros and other",
               "icon":"castle",
               "key":"historic",
               "value":"castle",
               "type":"TAG"
            },
            {
               "id":"boundary_stone",
               "name":"Boundary stone",
               "description":"Physical marker that identifies a boundary",
               "icon":null,
               "key":"historic",
               "value":"boundary_stone",
               "type":"TAG"
            },
            {
               "id":"charcoal_pile",
               "name":"Charcoal pile",
               "description":"Historic site of a charcoal pile",
               "icon":null,
               "key":"historic",
               "value":"charcoal_pile",
               "type":"TAG"
            },
            {
               "id":"tomb",
               "name":"Tomb",
               "description":"Structure where somebody has been buried",
               "icon":"cemetery",
               "key":"historic",
               "value":"tomb",
               "type":"TAG"
            },
            {
               "id":"citywalls",
               "name":"Citywalls",
               "description":"Historic citywall is a fortification used to defend a city",
               "icon":"castle",
               "key":"historic",
               "value":"citywalls",
               "type":"TAG"
            },
            {
               "id":"heritage",
               "name":"Heritage",
               "description":"Building/area/site/monument officially recognized for its historic or cultural value",
               "icon":"monument",
               "key":"historic",
               "value":"heritage",
               "type":"TAG"
            },
            {
               "id":"mine_shaft",
               "name":"Mine shaft",
               "description":"Vertical shafts of a historic mine",
               "icon":null,
               "key":"historic",
               "value":"mine_shaft",
               "type":"TAG"
            },
            {
               "id":"shieling",
               "name":"Shieling",
               "description":"Abandoned mountain pasture",
               "icon":"mountain",
               "key":"historic",
               "value":"shieling",
               "type":"TAG"
            },
            {
               "id":"mine",
               "name":"Mine",
               "description":"Location of abandoned underground mine workings for minerals such as coal or lead",
               "icon":null,
               "key":"historic",
               "value":"mine",
               "type":"TAG"
            },
            {
               "id":"railway",
               "name":"Railway",
               "description":"Dismantled railway",
               "icon":"rail",
               "key":"historic",
               "value":"railway",
               "type":"TAG"
            },
            {
               "id":"manor",
               "name":"Manor",
               "description":"Historic manors/mansions having different use today",
               "icon":"landmark",
               "key":"historic",
               "value":"manor",
               "type":"TAG"
            },
            {
               "id":"hollow_way",
               "name":"Hollow way",
               "description":"Path which has over time fallen significantly lower than the land on either side",
               "icon":null,
               "key":"historic",
               "value":"hollow_way",
               "type":"TAG"
            },
            {
               "id":"milestone",
               "name":"Milestone",
               "description":"Historic marker that shows the distance to important destinations",
               "icon":null,
               "key":"historic",
               "value":"milestone",
               "type":"TAG"
            },
            {
               "id":"fort",
               "name":"Fort",
               "description":"Historic, independent and permanent fortification",
               "icon":"castle",
               "key":"historic",
               "value":"fort",
               "type":"TAG"
            },
            {
               "id":"city_gate",
               "name":"City gate",
               "description":"Historic city gate within a city wall",
               "icon":"castle",
               "key":"historic",
               "value":"city_gate",
               "type":"TAG"
            },
            {
               "id":"bomb_crater",
               "name":"Bomb crater",
               "description":"Bomb crater",
               "icon":null,
               "key":"historic",
               "value":"bomb_crater",
               "type":"TAG"
            },
            {
               "id":"house",
               "name":"House",
               "description":"Historic single-unit residential building",
               "icon":"home",
               "key":"historic",
               "value":"house",
               "type":"TAG"
            },
            {
               "id":"wreck",
               "name":"Wreck",
               "description":"Nautical craft that has unintentionally been sunk or destroyed",
               "icon":"harbor",
               "key":"historic",
               "value":"wreck",
               "type":"TAG"
            },
            {
               "id":"stone",
               "name":"Stone",
               "description":"Stone shaped or placed by man with historical value",
               "icon":null,
               "key":"historic",
               "value":"stone",
               "type":"TAG"
            },
            {
               "id":"bunker",
               "name":"Bunker",
               "description":"Defensive military fortification designed to protect people and valued materials from falling bombs or other attacks",
               "icon":null,
               "key":"historic",
               "value":"bunker",
               "type":"TAG"
            },
            {
               "id":"pa",
               "name":"Pā",
               "description":"New Zealand Maori Pā",
               "icon":null,
               "key":"historic",
               "value":"pa",
               "type":"TAG"
            },
            {
               "id":"historic_farm",
               "name":"Farm",
               "description":"Historical farm, kept in its original state",
               "icon":"farm",
               "key":"historic",
               "value":"farm",
               "type":"TAG"
            },
            {
               "id":"roman_road",
               "name":"Roman road",
               "description":"Road that was built at the time of Roman Empire",
               "icon":null,
               "key":"historic",
               "value":"roman_road",
               "type":"TAG"
            },
            {
               "id":"aircraft",
               "name":"Aircraft",
               "description":"Decommissioned aircraft",
               "icon":"airfield",
               "key":"historic",
               "value":"aircraft",
               "type":"TAG"
            },
            {
               "id":"cannon",
               "name":"Cannon",
               "description":"Historic/retired cannon",
               "icon":null,
               "key":"historic",
               "value":"cannon",
               "type":"TAG"
            },
            {
               "id":"battlefield",
               "name":"Battlefield",
               "description":"The site of a battle or military skirmish in the past",
               "icon":null,
               "key":"historic",
               "value":"battlefield",
               "type":"TAG"
            },
            {
               "id":"monastery",
               "name":"Monastery",
               "description":"Building/place that was a monastery",
               "icon":"place-of-worship",
               "key":"historic",
               "value":"monastery",
               "type":"TAG"
            },
            {
               "id":"tower",
               "name":"Tower",
               "description":"Historic tower",
               "icon":"lighthouse",
               "key":"historic",
               "value":"tower",
               "type":"TAG"
            },
            {
               "id":"bridge",
               "name":"Bridge",
               "description":"Historic structure built to span a physical obstacle, such as a body of water, valley, or road",
               "icon":"bridge",
               "key":"historic",
               "value":"bridge",
               "type":"TAG"
            },
            {
               "id":"threshing_floor",
               "name":"Threshing floor",
               "description":"Paved floor of a barn on which in earlier times the grain was threshed with flails after the harvest",
               "icon":null,
               "key":"historic",
               "value":"threshing_floor",
               "type":"TAG"
            },
            {
               "id":"shelter",
               "name":"Shelter",
               "description":"Basic architectural structure or building that provides protection from the local environment",
               "icon":null,
               "key":"historic",
               "value":"shelter",
               "type":"TAG"
            },
            {
               "id":"ship",
               "name":"Ship",
               "description":"Decommissioned ship/submarine",
               "icon":null,
               "key":"historic",
               "value":"ship",
               "type":"TAG"
            },
            {
               "id":"industrial",
               "name":"Industrial",
               "description":"Land used for industrial purposes",
               "icon":"industry",
               "key":"historic",
               "value":"industrial",
               "type":"TAG"
            },
            {
               "id":"locomotive",
               "name":"Locomotive",
               "description":"Decommissioned locomotive",
               "icon":"rail",
               "key":"historic",
               "value":"locomotive",
               "type":"TAG"
            },
            {
               "id":"pillory",
               "name":"Pillory",
               "description":"Construction designed to immobilitate and humiliate a person who was convicted in lower courts",
               "icon":null,
               "key":"historic",
               "value":"pillory",
               "type":"TAG"
            },
            {
               "id":"technical_monument",
               "name":"Technical monument",
               "description":"Technical structure that was explicitly created to commemorate a person or event",
               "icon":"landmark",
               "key":"historic",
               "value":"technical_monument",
               "type":"TAG"
            },
            {
               "id":"aqueduct",
               "name":"Aqueduct",
               "description":"Historic structure to convey water",
               "icon":"bridge",
               "key":"historic",
               "value":"aqueduct",
               "type":"TAG"
            },
            {
               "id":"quarry",
               "name":"Quarry",
               "description":"Type of open-pit mine in which stone, rock, construction aggregate, riprap, sand, gravel, or slate is excavated from the ground",
               "icon":null,
               "key":"historic",
               "value":"quarry",
               "type":"TAG"
            },
            {
               "id":"fire_hydrant",
               "name":"Fire hydrant",
               "description":"Historic connection point by which firefighters can tap into a water supply",
               "icon":"fire-station",
               "key":"historic",
               "value":"fire_hydrant",
               "type":"TAG"
            },
            {
               "id":"canal",
               "name":"Canal",
               "description":"Historic waterway channel, or artificial waterways, for water conveyance, or to service water transport vehicles",
               "icon":null,
               "key":"historic",
               "value":"canal",
               "type":"TAG"
            },
            {
               "id":"lavoir",
               "name":"Lavoir",
               "description":"Historic public place set aside for the washing of clothes",
               "icon":"clothing-store",
               "key":"historic",
               "value":"lavoir",
               "type":"TAG"
            },
            {
               "id":"historic_chapel",
               "name":"Chapel",
               "description":"Historic christian place of prayer and worship that is usually relatively small",
               "icon":"landmark",
               "key":"historic",
               "value":"chapel",
               "type":"TAG"
            },
            {
               "id":"crop_mark",
               "name":"Crop mark",
               "description":"Means through which sub-surface archaeological, natural and recent features may be visible from the air",
               "icon":null,
               "key":"historic",
               "value":"crop_mark",
               "type":"TAG"
            },
            {
               "id":"tramway",
               "name":"Tramway",
               "description":"Historic rail vehicle that runs on tramway tracks along public urban streets",
               "icon":"rail-light",
               "key":"historic",
               "value":"tramway",
               "type":"TAG"
            },
            {
               "id":"rune_stone",
               "name":"Rune stone",
               "description":"Stones, boulders or bedrock with historical runic inscriptions",
               "icon":null,
               "key":"historic",
               "value":"rune_stone",
               "type":"TAG"
            },
            {
               "id":"road",
               "name":"Road",
               "description":"Historic thoroughfare on land between two places that has been improved to allow travel by foot or by some form of conveyance",
               "icon":null,
               "key":"historic",
               "value":"road",
               "type":"TAG"
            },
            {
               "id":"marker",
               "name":"Marker",
               "description":"Robust physical marker that identifies the start of a land boundary or the change in a boundary",
               "icon":"monument",
               "key":"historic",
               "value":"marker",
               "type":"TAG"
            },
            {
               "id":"palace",
               "name":"Palace",
               "description":"Grand residence, especially a royal residence, or the home of a head of state or some other high-ranking dignitary",
               "icon":"landmark",
               "key":"historic",
               "value":"palace",
               "type":"TAG"
            },
            {
               "id":"folly",
               "name":"Folly",
               "description":"Building constructed primarily for decoration",
               "icon":"castle",
               "key":"historic",
               "value":"folly",
               "type":"TAG"
            },
            {
               "id":"military",
               "name":"Military",
               "description":"Heavily armed, highly organized force primarily intended for warfare",
               "icon":"castle",
               "key":"historic",
               "value":"military",
               "type":"TAG"
            },
            {
               "id":"mine_adit",
               "name":"Mine adit",
               "description":"Entrance to an underground mine",
               "icon":null,
               "key":"historic",
               "value":"mine_adit",
               "type":"TAG"
            },
            {
               "id":"heritage_building",
               "name":"Heritage building",
               "description":"Heritage building",
               "icon":null,
               "key":"historic",
               "value":"heritage_building",
               "type":"TAG"
            },
            {
               "id":"cemetery",
               "name":"Cemetery",
               "description":"Place where the remains of dead people are buried or otherwise interred",
               "icon":"cemetery",
               "key":"historic",
               "value":"cemetery",
               "type":"TAG"
            },
            {
               "id":"historic_railway_station",
               "name":"Railway station",
               "description":"Historic railway facility or area where trains regularly stop to load or unload passengers or freight",
               "icon":"rail",
               "key":"historic",
               "value":"railway_station",
               "type":"TAG"
            },
            {
               "id":"historic_school",
               "name":"School",
               "description":"Historic primary or secondary school (pupils typically aged 6 to 18)",
               "icon":"school",
               "key":"historic",
               "value":"school",
               "type":"TAG"
            },
            {
               "id":"wall",
               "name":"Wall",
               "description":"Historic structure and a surface that defines an area, provides security, shelter, or soundproofing",
               "icon":"wall",
               "key":"historic",
               "value":"wall",
               "type":"TAG"
            },
            {
               "id":"watermill",
               "name":"Watermill",
               "description":"Historic mill that uses hydropower",
               "icon":"watermill",
               "key":"historic",
               "value":"watermill",
               "type":"TAG"
            },
            {
               "id":"fortification",
               "name":"Fortification",
               "description":"Military construction or building designed for the defense of territories in warfare",
               "icon":"castle",
               "key":"historic",
               "value":"fortification",
               "type":"TAG"
            },
            {
               "id":"protected_building",
               "name":"Protected building",
               "description":"Historic building that has a special architectural or historic interest",
               "icon":"castle",
               "key":"historic",
               "value":"protected_building",
               "type":"TAG"
            },
            {
               "id":"razed:watermill",
               "name":"Razed watermill",
               "description":"Destroyed mill that uses hydropower",
               "icon":"watermill",
               "key":"historic",
               "value":"razed:watermill",
               "type":"TAG"
            },
            {
               "id":"tank",
               "name":"Tank",
               "description":"Decommissioned tank",
               "icon":null,
               "key":"historic",
               "value":"tank",
               "type":"TAG"
            },
            {
               "id":"mule_path",
               "name":"Mule path",
               "description":"Path, trail or a thoroughfare that is used by people riding on horses",
               "icon":null,
               "key":"historic",
               "value":"mule_path",
               "type":"TAG"
            },
            {
               "id":"country_marker",
               "name":"Country marker",
               "description":"Country marker",
               "icon":null,
               "key":"historic",
               "value":"country_marker",
               "type":"TAG"
            },
            {
               "id":"historic_park",
               "name":"Park",
               "description":"Historic public green space used for recreation",
               "icon":"park",
               "key":"historic",
               "value":"park",
               "type":"TAG"
            },
            {
               "id":"earthworks",
               "name":"Earthworks",
               "description":"Artificial changes in land level, typically made from piles of artificially placed or sculpted rocks and soil",
               "icon":null,
               "key":"historic",
               "value":"earthworks",
               "type":"TAG"
            },
            {
               "id":"croft",
               "name":"Croft",
               "description":"Fenced or enclosed area of land, usually small and arable",
               "icon":null,
               "key":"historic",
               "value":"croft",
               "type":"TAG"
            },
            {
               "id":"kiln",
               "name":"Kiln",
               "description":"Historic type of oven, that produces temperatures sufficient to complete some process, such as hardening, drying, or chemical changes",
               "icon":null,
               "key":"historic",
               "value":"kiln",
               "type":"TAG"
            },
            {
               "id":"villa",
               "name":"Villa",
               "description":"Historic elegant upper-class country home",
               "icon":"landmark",
               "key":"historic",
               "value":"villa",
               "type":"TAG"
            },
            {
               "id":"city_wall",
               "name":"City wall",
               "description":"Historic fortification usually used to protect a city, town or other settlement from potential aggressors",
               "icon":"castle",
               "key":"historic",
               "value":"city_wall",
               "type":"TAG"
            },
            {
               "id":"disused",
               "name":"Disused",
               "description":"Historic disused site",
               "icon":null,
               "key":"historic",
               "value":"disused",
               "type":"TAG"
            },
            {
               "id":"rail",
               "name":"Rail",
               "description":"Historic structure consisting of the rails, fasteners, railroad ties and ballast",
               "icon":"rail",
               "key":"historic",
               "value":"rail",
               "type":"TAG"
            },
            {
               "id":"railway_car",
               "name":"Railway car",
               "description":"Decommissioned railway car which generally remains in one place",
               "icon":"rail",
               "key":"historic",
               "value":"railway_car",
               "type":"TAG"
            },
            {
               "id":"abandoned",
               "name":"Abandoned",
               "description":"Historic abandoned site",
               "icon":null,
               "key":"historic",
               "value":"abandoned",
               "type":"TAG"
            },
            {
               "id":"exhibit",
               "name":"Exhibit",
               "description":"Organized presentation and display of a selection of items",
               "icon":null,
               "key":"historic",
               "value":"exhibit",
               "type":"TAG"
            },
            {
               "id":"grave",
               "name":"Grave",
               "description":"Location where a dead body is buried",
               "icon":"cemetery",
               "key":"historic",
               "value":"grave",
               "type":"TAG"
            },
            {
               "id":"district",
               "name":"District",
               "description":"Type of administrative division that, in some countries, is managed by local government",
               "icon":null,
               "key":"historic",
               "value":"district",
               "type":"TAG"
            },
            {
               "id":"tree_shrine",
               "name":"Tree shrine",
               "description":"Tree with a religious image on it",
               "icon":"park",
               "key":"historic",
               "value":"tree_shrine",
               "type":"TAG"
            },
            {
               "id":"gate",
               "name":"Gate",
               "description":"Historic point of entry to a space which is enclosed by walls",
               "icon":"castle",
               "key":"historic",
               "value":"gate",
               "type":"TAG"
            },
            {
               "id":"optical_telegraph",
               "name":"Optical telegraph",
               "description":"Line of stations, typically towers, for the purpose of conveying textual information by means of visual signals",
               "icon":null,
               "key":"historic",
               "value":"optical_telegraph",
               "type":"TAG"
            },
            {
               "id":"plaque",
               "name":"Plaque",
               "description":"Plate typically attached to a wall and bearing text or an image in relief",
               "icon":"cemetery",
               "key":"historic",
               "value":"plaque",
               "type":"TAG"
            },
            {
               "id":"castle_wall",
               "name":"Castle wall",
               "description":"Fortification surrounding the bailey of a castle",
               "icon":"castle",
               "key":"historic",
               "value":"castle_wall",
               "type":"TAG"
            },
            {
               "id":"highwater_mark",
               "name":"Highwater mark",
               "description":"Marker for indicating past flood",
               "icon":null,
               "key":"historic",
               "value":"highwater_mark",
               "type":"TAG"
            },
            {
               "id":"timber_tow",
               "name":"Timber tow",
               "description":"Timber tow",
               "icon":null,
               "key":"historic",
               "value":"timber_tow",
               "type":"TAG"
            },
            {
               "id":"statue",
               "name":"Statue",
               "description":"Free-standing sculpture in which the realistic figures of persons or animals are carved or cast in a durable material",
               "icon":null,
               "key":"historic",
               "value":"statue",
               "type":"TAG"
            },
            {
               "id":"c_fountain",
               "name":"Fountain",
               "description":"Fountain for cultural / decorational / recreational purposes",
               "icon":null,
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"amenity_fountain",
                     "name":"Fountain",
                     "description":"Fountain for cultural / decorational / recreational purposes",
                     "icon":null,
                     "key":"amenity",
                     "value":"fountain",
                     "type":"TAG"
                  },
                  {
                     "id":"historic_fountain",
                     "name":"Fountain",
                     "description":"Historic fountain for cultural / decorational / recreational purposes",
                     "icon":null,
                     "key":"historic",
                     "value":"fountain",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"c_place_of_worship",
               "name":"Place of worship",
               "description":"Place where religious services are conducted",
               "icon":"place-of-worship",
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"amenity_place_of_worship",
                     "name":"Place of worship",
                     "description":"Place where religious services are conducted",
                     "icon":"place-of-worship",
                     "key":"amenity",
                     "value":"place_of_worship",
                     "type":"TAG"
                  },
                  {
                     "id":"historic_place_of_worship",
                     "name":"Place of worship",
                     "description":"Historic place where religious services are conducted",
                     "icon":"place-of-worship",
                     "key":"historic",
                     "value":"place_of_worship",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"c_chapel",
               "name":"Chapel",
               "description":"Christian place of prayer and worship that is usually relatively small",
               "icon":"religious-christian",
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"building_chapel",
                     "name":"Chapel",
                     "description":"Christian place of prayer and worship that is usually relatively small",
                     "icon":"religious-christian",
                     "key":"building",
                     "value":"chapel",
                     "type":"TAG"
                  },
                  {
                     "id":"wayside_chapel",
                     "name":"Wayside chapel",
                     "description":"Shrine showing a religious depiction",
                     "icon":"religious-christian",
                     "key":"historic",
                     "value":"wayside_chapel",
                     "type":"TAG"
                  }
               ]
            },
            {
               "id":"c_church",
               "name":"Church",
               "description":"Building with value for Christian religious activities, particularly for worship services",
               "icon":"religious-christian",
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"building_church",
                     "name":"Church",
                     "description":"Building with value for Christian religious activities, particularly for worship services",
                     "icon":"religious-christian",
                     "key":"building",
                     "value":"church",
                     "type":"TAG"
                  },
                  {
                     "id":"historic_church",
                     "name":"Church",
                     "description":"Building with historical value for Christian religious activities, particularly for worship services",
                     "icon":"religious-christian",
                     "key":"historic",
                     "value":"church",
                     "type":"TAG"
                  }
               ]
            }
         ]
      },
      {
         "id":"g_office",
         "name":"Offices",
         "description":"Office buildings, co-working places, etc.",
         "icon":"building-alt1",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"office",
               "name":"Office building",
               "description":"Office building",
               "icon":"building-alt1",
               "key":"building",
               "value":"office",
               "type":"TAG"
            },
            {
               "id":"hackerspace",
               "name":"Hackerspace",
               "description":"Place where people with common interests (science, technology) meet",
               "icon":"rocket",
               "key":"leisure",
               "value":"hackerspace",
               "type":"TAG"
            },
            {
               "id":"coworking_space",
               "name":"Coworking space",
               "description":"Place where people can go to work (might require a fee)",
               "icon":"building-alt1",
               "key":"amenity",
               "value":"coworking_space",
               "type":"TAG"
            },
            {
               "id":"studio",
               "name":"Studio",
               "description":"Studio used for creating radio or television programmes and broadcasting them",
               "icon":"music",
               "key":"amenity",
               "value":"studio",
               "type":"TAG"
            },
            {
               "id":"courthouse",
               "name":"Courthouse",
               "description":"Building home to a court of law",
               "icon":"town-hall",
               "key":"amenity",
               "value":"courthouse",
               "type":"TAG"
            },
            {
               "id":"embassy",
               "name":"Embassy",
               "description":"Representation of a country in another country",
               "icon":"embassy",
               "key":"amenity",
               "value":"embassy",
               "type":"TAG"
            },
            {
               "id":"townhall",
               "name":"Townhall",
               "description":"Townhall serves as a community administrative center or meeting place",
               "icon":"town-hall",
               "key":"amenity",
               "value":"townhall",
               "type":"TAG"
            },
            {
               "id":"accountant",
               "name":"Accountant",
               "description":"Office for an accountant",
               "icon":null,
               "key":"office",
               "value":"accountant",
               "type":"TAG"
            },
            {
               "id":"adoption_agency",
               "name":"Adoption agency",
               "description":"Place where prospective parent/s may adopt a child or children",
               "icon":null,
               "key":"office",
               "value":"adoption_agency",
               "type":"TAG"
            },
            {
               "id":"advertising_agency",
               "name":"Advertising agency",
               "description":"Service-based business dedicated to creating, planning, and handling advertising",
               "icon":null,
               "key":"office",
               "value":"advertising_agency",
               "type":"TAG"
            },
            {
               "id":"architect",
               "name":"Architect",
               "description":"Office for an architect or group of architects",
               "icon":"building-alt1",
               "key":"office",
               "value":"architect",
               "type":"TAG"
            },
            {
               "id":"association",
               "name":"Association",
               "description":"Office of a non-profit organisation, society, e.g. student, sport, consumer, automobile or bike association",
               "icon":null,
               "key":"office",
               "value":"association",
               "type":"TAG"
            },
            {
               "id":"office_charity",
               "name":"Charity",
               "description":"Office of a charitable organization",
               "icon":"heart",
               "key":"office",
               "value":"charity",
               "type":"TAG"
            },
            {
               "id":"company",
               "name":"Company",
               "description":"Office of a private company",
               "icon":"building-alt1",
               "key":"office",
               "value":"company",
               "type":"TAG"
            },
            {
               "id":"coworking",
               "name":"Coworking",
               "description":"Office where people can go to work (might require a fee)",
               "icon":"building-alt1",
               "key":"office",
               "value":"coworking",
               "type":"TAG"
            },
            {
               "id":"diplomatic",
               "name":"Diplomatic",
               "description":"Diplomatic, consular and liaison missions of foreign governments and parastatal entities in a host country",
               "icon":"embassy",
               "key":"office",
               "value":"diplomatic",
               "type":"TAG"
            },
            {
               "id":"educational_institution",
               "name":"Educational institution",
               "description":"Office for an educational institution",
               "icon":"college",
               "key":"office",
               "value":"educational_institution",
               "type":"TAG"
            },
            {
               "id":"employment_agency",
               "name":"Employment agency",
               "description":"Office for an employment service",
               "icon":null,
               "key":"office",
               "value":"employment_agency",
               "type":"TAG"
            },
            {
               "id":"energy_supplier",
               "name":"Energy supplier",
               "description":"Office for a energy supplier",
               "icon":"fire-station",
               "key":"office",
               "value":"energy_supplier",
               "type":"TAG"
            },
            {
               "id":"engineer",
               "name":"Engineer",
               "description":"Office for an engineer or group of engineers",
               "icon":"rocket",
               "key":"office",
               "value":"engineer",
               "type":"TAG"
            },
            {
               "id":"estate_agent",
               "name":"Estate agent",
               "description":"Place where you can rent or buy a house",
               "icon":"home",
               "key":"office",
               "value":"estate_agent",
               "type":"TAG"
            },
            {
               "id":"financial",
               "name":"Financial",
               "description":"Office of a company in the financial sector",
               "icon":"bank",
               "key":"office",
               "value":"financial",
               "type":"TAG"
            },
            {
               "id":"forestry",
               "name":"Forestry",
               "description":"Forestry office",
               "icon":"park-alt1",
               "key":"office",
               "value":"forestry",
               "type":"TAG"
            },
            {
               "id":"foundation",
               "name":"Foundation",
               "description":"Office of a foundation",
               "icon":"heart",
               "key":"office",
               "value":"foundation",
               "type":"TAG"
            },
            {
               "id":"geodesist",
               "name":"Geodesist",
               "description":"Office of a person doing land surveys",
               "icon":null,
               "key":"office",
               "value":"geodesist",
               "type":"TAG"
            },
            {
               "id":"government",
               "name":"Government",
               "description":"Office of a (supra)national, regional or local government agency or department",
               "icon":"embassy",
               "key":"office",
               "value":"government",
               "type":"TAG"
            },
            {
               "id":"guide",
               "name":"Guide",
               "description":"Office for tour guides, mountain guides, dive guides",
               "icon":"information",
               "key":"office",
               "value":"guide",
               "type":"TAG"
            },
            {
               "id":"insurance",
               "name":"Insurance",
               "description":"Office at which you can take out insurance policies",
               "icon":"bank",
               "key":"office",
               "value":"insurance",
               "type":"TAG"
            },
            {
               "id":"it",
               "name":"IT",
               "description":"Office for an IT specialist",
               "icon":null,
               "key":"office",
               "value":"it",
               "type":"TAG"
            },
            {
               "id":"lawyer",
               "name":"Lawyer",
               "description":"Law firm",
               "icon":null,
               "key":"office",
               "value":"lawyer",
               "type":"TAG"
            },
            {
               "id":"logistics",
               "name":"Logistics",
               "description":"Office for a forwarder / hauler",
               "icon":null,
               "key":"office",
               "value":"logistics",
               "type":"TAG"
            },
            {
               "id":"moving_company",
               "name":"Moving company",
               "description":"Office which offers a relocation service",
               "icon":null,
               "key":"office",
               "value":"moving_company",
               "type":"TAG"
            },
            {
               "id":"newspaper",
               "name":"Newspaper",
               "description":"Office of a newspaper",
               "icon":"library",
               "key":"office",
               "value":"newspaper",
               "type":"TAG"
            },
            {
               "id":"ngo",
               "name":"NGO",
               "description":"Office for a non-government organisation",
               "icon":"recycling",
               "key":"office",
               "value":"ngo",
               "type":"TAG"
            },
            {
               "id":"notary",
               "name":"Notary",
               "description":"Office for a notary public",
               "icon":"home",
               "key":"office",
               "value":"notary",
               "type":"TAG"
            },
            {
               "id":"parish",
               "name":"Parish",
               "description":"Parish office",
               "icon":"religious-christian",
               "key":"office",
               "value":"parish",
               "type":"TAG"
            },
            {
               "id":"political_party",
               "name":"Political party",
               "description":"Office of a political party",
               "icon":"embassy",
               "key":"office",
               "value":"political_party",
               "type":"TAG"
            },
            {
               "id":"private_investigator",
               "name":"Private investigator",
               "description":"Office of a private investigator",
               "icon":null,
               "key":"office",
               "value":"private_investigator",
               "type":"TAG"
            },
            {
               "id":"property_management",
               "name":"Property management",
               "description":"Office of a company, which manages a real estate property",
               "icon":null,
               "key":"office",
               "value":"property_management",
               "type":"TAG"
            },
            {
               "id":"publisher",
               "name":"Publisher",
               "description":"Office of a company which publishes books or music",
               "icon":"library",
               "key":"office",
               "value":"publisher",
               "type":"TAG"
            },
            {
               "id":"quango",
               "name":"Quango",
               "description":"Office of a quasi-autonomous non-governmental organisation",
               "icon":"embassy",
               "key":"office",
               "value":"quango",
               "type":"TAG"
            },
            {
               "id":"office_religion",
               "name":"Religion",
               "description":"Office of a community of faith",
               "icon":"place-of-worship",
               "key":"office",
               "value":"religion",
               "type":"TAG"
            },
            {
               "id":"research",
               "name":"Research",
               "description":"Office for research and development",
               "icon":null,
               "key":"office",
               "value":"research",
               "type":"TAG"
            },
            {
               "id":"surveyor",
               "name":"Surveyor",
               "description":"Office of a person doing surveys",
               "icon":null,
               "key":"office",
               "value":"surveyor",
               "type":"TAG"
            },
            {
               "id":"tax",
               "name":"Tax",
               "description":"Fiscal authorities, tax and revenue office",
               "icon":"bank",
               "key":"office",
               "value":"tax",
               "type":"TAG"
            },
            {
               "id":"tax_advisor",
               "name":"Tax advisor",
               "description":"Office for a financial expert specially trained in tax law",
               "icon":"information",
               "key":"office",
               "value":"tax_advisor",
               "type":"TAG"
            },
            {
               "id":"telecommunication",
               "name":"Telecommunication",
               "description":"Office for a telecommunication company",
               "icon":"communications-tower",
               "key":"office",
               "value":"telecommunication",
               "type":"TAG"
            },
            {
               "id":"therapist",
               "name":"Therapist",
               "description":"Office for a physical therapy, such as physiotherapy, therapy against neurologic diseases or osteopathy",
               "icon":"doctor",
               "key":"office",
               "value":"therapist",
               "type":"TAG"
            },
            {
               "id":"travel_agent",
               "name":"Travel agent",
               "description":"Shop selling travel related products and services",
               "icon":"globe",
               "key":"office",
               "value":"travel_agent",
               "type":"TAG"
            },
            {
               "id":"visa",
               "name":"Visa",
               "description":"Office of an organisation offering visa assistance",
               "icon":"embassy",
               "key":"office",
               "value":"visa",
               "type":"TAG"
            },
            {
               "id":"water_utility",
               "name":"Water utility",
               "description":"The office for a water utility company or water board",
               "icon":"drinking-water",
               "key":"office",
               "value":"water_utility",
               "type":"TAG"
            }
         ]
      },
      {
         "id":"g_vehicle",
         "name":"Cars-vehicles",
         "description":"All places to do with vehicles such as gas stations, car dealers, etc.",
         "icon":"car",
         "type":"CATEGORY",
         "contents":[
            {
               "id":"car",
               "name":"Car",
               "description":"Shop in which mainly cars are sold",
               "icon":"car",
               "key":"shop",
               "value":"car",
               "type":"TAG"
            },
            {
               "id":"car_repair",
               "name":"Car repair",
               "description":"Shop where cars are repaired",
               "icon":"car-repair",
               "key":"shop",
               "value":"car_repair",
               "type":"TAG"
            },
            {
               "id":"car_parts",
               "name":"Car parts",
               "description":"Shop selling auto parts, auto accessories, motor oil and car chemicals",
               "icon":"car-repair",
               "key":"shop",
               "value":"car_parts",
               "type":"TAG"
            },
            {
               "id":"car_rental",
               "name":"Car rental",
               "description":"Place from which cars can be rented",
               "icon":"car-rental",
               "key":"amenity",
               "value":"car_rental",
               "type":"TAG"
            },
            {
               "id":"car_sharing",
               "name":"Car sharing",
               "description":"Carsharing station, where you get your booked car",
               "icon":"car-rental",
               "key":"amenity",
               "value":"car_sharing",
               "type":"TAG"
            },
            {
               "id":"car_wash",
               "name":"Car wash",
               "description":"Place where you can wash your car",
               "icon":"car",
               "key":"amenity",
               "value":"car_wash",
               "type":"TAG"
            },
            {
               "id":"vehicle_inspection",
               "name":"Vehicle inspection",
               "description":"Government vehicle inspection",
               "icon":"car-repair",
               "key":"amenity",
               "value":"vehicle_inspection",
               "type":"TAG"
            },
            {
               "id":"charging_station",
               "name":"Charging station",
               "description":"Station that supplies energy to electrical vehicles",
               "icon":"charging-station",
               "key":"amenity",
               "value":"charging_station",
               "type":"TAG"
            },
            {
               "id":"amenity_fuel",
               "name":"Gas station",
               "description":"Retail facility for refueling cars",
               "icon":"fuel",
               "key":"amenity",
               "value":"fuel",
               "type":"TAG"
            },
            {
               "id":"rest_area",
               "name":"Rest area",
               "description":"Place where drivers can leave the road to rest, but not refuel",
               "icon":null,
               "key":"highway",
               "value":"rest_area",
               "type":"TAG"
            },
            {
               "id":"shop_fuel",
               "name":"Fuel",
               "description":"Shop selling fuels",
               "icon":"fuel",
               "key":"shop",
               "value":"fuel",
               "type":"TAG"
            },
            {
               "id":"motorcycle",
               "name":"Motorcycle",
               "description":"Shop selling motorcycles and/or related accessories and services",
               "icon":"scooter",
               "key":"shop",
               "value":"motorcycle",
               "type":"TAG"
            },
            {
               "id":"tyres",
               "name":"Tyres",
               "description":"Shop selling tyres",
               "icon":"car-repair",
               "key":"shop",
               "value":"tyres",
               "type":"TAG"
            },
            {
               "id":"atv",
               "name":"ATV",
               "description":"Shop selling ATVs and/or related accessories and services",
               "icon":"car",
               "key":"shop",
               "value":"atv",
               "type":"TAG"
            },
            {
               "id":"parking_entrance",
               "name":"Parking entrance",
               "description":"Entrance to an underground or multi storey parking facility",
               "icon":"entrance-alt1",
               "key":"amenity",
               "value":"parking_entrance",
               "type":"TAG"
            },
            {
               "id":"parking_space",
               "name":"Parking space",
               "description":"Single parking space on a parking lot",
               "icon":"parking",
               "key":"amenity",
               "value":"parking_space",
               "type":"TAG"
            },
            {
               "id":"driving_school",
               "name":"Driving school",
               "description":"School to learn to drive a motor vehicle",
               "icon":"car",
               "key":"amenity",
               "value":"driving_school",
               "type":"TAG"
            },
            {
               "id":"garage",
               "name":"Garage",
               "description":"Denotes a single-owner private garage",
               "icon":"parking-garage",
               "key":"building",
               "value":"garage",
               "type":"TAG"
            },
            {
               "id":"bicycle",
               "name":"Bicycle",
               "description":"Shop selling and/or repairing your bike and further services",
               "icon":"bicycle",
               "key":"shop",
               "value":"bicycle",
               "type":"TAG"
            },
            {
               "id":"bicycle_parking",
               "name":"Bicycle parking",
               "description":"Place for parking bicycles",
               "icon":"parking",
               "key":"amenity",
               "value":"bicycle_parking",
               "type":"TAG"
            },
            {
               "id":"bicycle_repair_station",
               "name":"Bicycle repair station",
               "description":"Public tool for self-repair of bicycles",
               "icon":"bicycle",
               "key":"amenity",
               "value":"bicycle_repair_station",
               "type":"TAG"
            },
            {
               "id":"bicycle_rental",
               "name":"Bicycle rental",
               "description":"Place where you can pick up and drop off rented bikes",
               "icon":"bicycle-share",
               "key":"amenity",
               "value":"bicycle_rental",
               "type":"TAG"
            },
            {
               "id":"boat_rental",
               "name":"Boat rental",
               "description":"Place where you can rent a boat",
               "icon":"harbor",
               "key":"amenity",
               "value":"boat_rental",
               "type":"TAG"
            },
            {
               "id":"boat_sharing",
               "name":"Boat sharing",
               "description":"Location of a boat to share",
               "icon":"harbor",
               "key":"amenity",
               "value":"boat_sharing",
               "type":"TAG"
            },
            {
               "id":"motorcycle_parking",
               "name":"Motorcycle parking",
               "description":"Place which is designated for parking motorcycles",
               "icon":"parking",
               "key":"amenity",
               "value":"motorcycle_parking",
               "type":"TAG"
            },
            {
               "id":"ferry_terminal",
               "name":"Ferry terminal",
               "description":"Place where people/cars/etc can board and leave a ferry",
               "icon":"ferry",
               "key":"amenity",
               "value":"ferry_terminal",
               "type":"TAG"
            },
            {
               "id":"boat",
               "name":"Boat",
               "description":"Shop selling and/or repairing your boat and further services",
               "icon":"harbor",
               "key":"shop",
               "value":"boat",
               "type":"TAG"
            },
            {
               "id":"jetski",
               "name":"Jetski",
               "description":"Shop selling jetskis and/or related accessories, clothes, parts, repair and rental services",
               "icon":null,
               "key":"shop",
               "value":"jetski",
               "type":"TAG"
            },
            {
               "id":"snowmobile",
               "name":"Snowmobile",
               "description":"Shop selling snowmobiles and/or related accessories and services",
               "icon":"snowmobile",
               "key":"shop",
               "value":"snowmobile",
               "type":"TAG"
            },
            {
               "id":"c_parking",
               "name":"Parking",
               "description":"Place for parking cars",
               "icon":"parking",
               "type":"COMPOSITE_TAG",
               "contents":[
                  {
                     "id":"amenity_parking",
                     "name":"Parking",
                     "description":"Place for parking cars",
                     "icon":"parking",
                     "key":"amenity",
                     "value":"parking",
                     "type":"TAG"
                  },
                  {
                     "id":"building_parking",
                     "name":"Parking",
                     "description":"Structure purpose-built for parking cars",
                     "icon":"parking-garage",
                     "key":"building",
                     "value":"parking",
                     "type":"TAG"
                  }
               ]
            }
         ]
      }
   ]
    `
  }
}