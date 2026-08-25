export type AccessoryProduct = { id:string; name:string; group:string; price:number; image:string; position:string; stock:number; description:string };

const positions=["0% 0%","33.333% 0%","66.666% 0%","100% 0%","0% 100%","33.333% 100%","66.666% 100%","100% 100%"];
const collections=[
  {prefix:"helmet",group:"Helmets",image:"helmet-sheet.png",base:26800,names:["R1 SPORT FULL-FACE","FLIP MODULAR","TRAIL ADVENTURE","CLASSIC OPEN-FACE","NEON RACING","SILVER TOURING","MX OFF-ROAD","VINTAGE FULL-FACE"]},
  {prefix:"jacket",group:"Jackets",image:"jacket-sheet.png",base:24800,names:["ARMORED TEXTILE JACKET","VINTAGE LEATHER JACKET","RED SPORT LEATHER","NEON TOURING SHELL","BLUE SUMMER MESH","ADVENTURE PRO JACKET","URBAN RIDING HOODIE","WAXED CLASSIC JACKET"]},
  {prefix:"glove",group:"Gloves",image:"glove-sheet.png",base:7800,names:["LEATHER GAUNTLET","RED SPORT GLOVES","VINTAGE BROWN GLOVES","WATERPROOF TOURING","BLUE SUMMER MESH","ADVENTURE ARMORED","URBAN SHORT GLOVES","WHITE RACING GLOVES"]},
  {prefix:"boot",group:"Boots",image:"boot-sheet.png",base:16800,names:["BLACK TOURING BOOTS","VINTAGE LEATHER BOOTS","RED RACING BOOTS","ADVENTURE WATERPROOF","URBAN RIDING SNEAKERS","MX TALL BOOTS","CRUISER ENGINEER BOOTS","COMMUTER ANKLE BOOTS"]},
  {prefix:"luggage",group:"Luggage",image:"luggage-sheet.png",base:12800,names:["45L TOP CASE","ALUMINUM PANNIER SET","LEATHER SADDLEBAGS","WATERPROOF TAIL BAG","MAGNETIC TANK BAG","COMPACT SIDE CASES","ROLL-TOP DUFFEL","REAR RACK TOOL BAG"]},
  {prefix:"mount",group:"Phone mounts",image:"mount-sheet.png",base:4800,names:["HANDLEBAR PHONE MOUNT","VIBRATION-DAMPED MOUNT","WIRELESS CHARGING MOUNT","MIRROR-STEM MOUNT","FORK-STEM SPORT MOUNT","WATERPROOF CASE MOUNT","NAVIGATION TABLET MOUNT","ACTION CAMERA MOUNT"]},
  {prefix:"security",group:"Security",image:"security-sheet.png",base:6800,names:["HARDENED CHAIN LOCK","YELLOW DISC LOCK","ALARM DISC LOCK","HEAVY U-LOCK","STEEL CABLE LOCK","FOLDING SECURITY LOCK","GROUND ANCHOR KIT","COMPACT GPS TRACKER"]},
  {prefix:"cover",group:"Covers",image:"cover-sheet.png",base:6800,names:["INDOOR DUST COVER","ALL-WEATHER COVER","ADVENTURE BIKE COVER","TOURING BIKE COVER","SPORT BIKE COVER","CRUISER BIKE COVER","HEAT-RESISTANT COVER","COMPACT TRAVEL COVER"]},
] as const;

export const accessoryProducts:AccessoryProduct[]=collections.flatMap((collection)=>collection.names.map((name,index)=>({
  id:`${collection.prefix}-${index+1}`,
  name:`GW ${name}`,
  group:collection.group,
  price:collection.base+index*1800,
  image:`/images/${collection.image}`,
  position:positions[index],
  stock:6+(index*3)%17,
  description:`Distinct ${name.toLowerCase()} designed for everyday motorcycle riders.`,
})));
