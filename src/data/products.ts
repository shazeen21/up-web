export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  brand: "uphaar" | "kyddoz" | "festive";
  badge?: string;
  description?: string | string[];
  material?: string;
  thickness?: string;
  rate?: string;
  customizable?: boolean;
  features?: string[];
  sizes?: string[] | { label: string; size: string }[];
  colors?: { name: string; hex: string }[];
  aspect_ratio?: string;
  customizationForm?: {
    name: string;
    label: string;
    type: "text" | "select" | "color";
    options?: string[];
    required?: boolean;
    placeholder?: string;
  }[];
};


export const featuredProducts: Product[] = [
  {
    id: "fp-01",
    name: "Pool & Summer Fun 3-Piece Set",
    price: 2250,
    image: "/images/featuredProducts/fp-01/set.jpeg",
    images: ["/images/featuredProducts/fp-01/set.jpeg"],
    brand: "kyddoz",
    badge: "Featured",
    features: [
      "Jelly swim bag personalised with initials",
      "Towel (30 × 60 inches)",
      "Bottle included",
      "Perfect for pool days, summer outings, and vacations"
    ]
  },
  {
    id: "fp-02",
    name: "Premium PU Leather Crafted 2026 Diary",
    price: 0,
    image: "/images/featuredProducts/fp-02/diary.jpeg",
    images: ["/images/featuredProducts/fp-02/diary.jpeg"],
    brand: "uphaar",
    badge: "Featured",
    features: [
      "High-quality PU leather cover with a premium finish",
      "Daily and monthly layouts for structured planning",
      "Helps break goals into clear, manageable actions",
      "Custom logo embossing or name personalisation available",
      "Ideal for professionals, executives, and corporate gifting"
    ]
  },
  {
    id: "fp-03",
    name: "Bath Essentials 3-Piece Set",
    price: 2300,
    image: "/images/featuredProducts/fp-03/bath.jpeg",
    images: ["/images/featuredProducts/fp-03/bath.jpeg"],
    brand: "kyddoz",
    badge: "Featured",
    features: [
      "Bath towel (24 × 48 inches)",
      "Bathrobe (XL size)",
      "Travel utility pouch",
      "Designed for personalised comfort",
      "Ideal for self-care, travel, and gifting"
    ]
  },
  {
    id: "fp-04",
    name: "Premium Travel Pouch",
    price: 0,
    image: "/images/featuredProducts/fp-04/faux.png",
    images: ["/images/featuredProducts/fp-04/faux.png"],
    brand: "uphaar",
    badge: "Featured",
    features: [
      "Premium design blending practical utility with professional aesthetics",
      "Personalised branding with custom-engraved nameplates and symbolic charms",
      "Durable construction suitable for frequent travel",
      "Elegant finish suitable for vanity or travel use",
      "Available in Charcoal Black and Sandstone Beige",
      "Ideal for Women’s Day gifting and corporate giveaways"
    ],
    customizationForm: [
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "Black",
          "Beige",
          "D Green",
          "Mint Green",
          "Tan",
          "Nude Pink",
          "Baby Pink",
          "S Grey",
          "Baby Grey",
          "M Yellow"
        ]
      },
      {
        name: "charm",
        label: "Select Charm",
        type: "select",
        required: true,
        options: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
          "47",
          "48",
          "49",
          "50",
          "51",
          "52",
          "53",
          "54",
          "55",
          "56",
          "57",
          "58",
          "59",
          "60",
          "61",
          "62",
          "63",
          "64",
          "65",
          "66",
          "67",
          "68",
          "69",
          "70",
          "71",
          "72",
          "73",
          "74",
          "75",
          "76",
          "77",
          "78",
          "79",
          "80",
          "81",
          "82",
          "83",
          "84",
          "85",
          "86",
          "87",
          "88",
          "89"
        ]
      }
    ]
  },
  {
    id: "fp-05",
    name: "Personalized Kids Study Table",
    price: 1399,
    image: "/images/featuredProducts/fp-05/frame.png",
    images: [
      "/images/featuredProducts/fp-05/frame.png",
      "/images/featuredProducts/fp-05/frame2.jpeg"
    ],
    brand: "kyddoz",
    badge: "Featured",
    features: [
      "Portable & Rectangular design",
      "Selected theme & name in acrylic print (16” × 10”)",
      "Dimensions: 19” × 13” × 7.5” (L × H × W)",
      "Material: Wood with canvas cotton handle",
      "Ideal for playrooms and creative activities"
    ]
  },
  {
    id: "fp-06",
    name: "Mouse Pad with Company Logo & Daily Calendar (2026)",
    price: 0,
    image: "/images/featuredProducts/fp-06/lap.jpg",
    images: ["/images/featuredProducts/fp-06/lap.jpg"],
    brand: "uphaar",
    badge: "Featured",
    features: [
      "Integrated 2026 daily calendar for easy date reference",
      "Precision surface optimized for all mouse types",
      "Smooth and accurate navigation for everyday professional use",
      "Large surface area for high-impact logo and tagline branding",
      "Ensures constant brand visibility on office desks",
      "Ideal for tech companies, IT departments, and bulk promotional giveaways"
    ]
  },
  {
    id: "fp-07",
    name: "Cute Girly Utility 4-Piece Set",
    price: 2800,
    image: "/images/featuredProducts/fp-07/bag.jpeg",
    images: ["/images/featuredProducts/fp-07/bag.jpeg"],
    brand: "kyddoz",
    badge: "Featured",
    features: [
      "Includes a stylish lunch bag",
      "Jewellery box (6 × 6 × 4 inches)",
      "Hanging wooden doorplate",
      "Skinny tumbler with stainless steel straw",
      "Perfect everyday utility combo with a cute, girly vibe",
      "Ideal for gifting and personal use"
    ]
  },
  {
    id: "fp-08",
    name: "Executive Leather Long Wallet",
    price: 0,
    image: "/images/featuredProducts/fp-08/card.jpeg",
    images: ["/images/featuredProducts/fp-08/card.jpeg"],
    brand: "uphaar",
    badge: "Featured",
    features: [
      "Premium leather finish with a soft, durable feel",
      "Multiple slots for cards, SIM cards, keys, and smartphone",
      "Integrated zippered compartment for secure storage",
      "Sleek long-wallet design for everyday professional use",
      "Available in classic brown and sleek black dual-tone options"
    ],
    customizationForm: [
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "Black",
          "Brown"
        ]
      }
    ]
  },
  {
    id: "fp-09",
    name: "Lunch Set",
    price: 2300,
    image: "/images/featuredProducts/fp-09/lunc.jpeg",
    images: ["/images/featuredProducts/fp-09/lunc.jpeg"],
    brand: "kyddoz",
    badge: "Featured",
    features: [
      "Jumbo tiffin with vegetable box",
      "Easy-to-sip steel sipper bottle with straw",
      "High-grade steel thali with 3 partitions",
      "Includes glass, fork, and spoon",
      "Ideal for a complete and power-packed lunch break"
    ]
  },
  {
    id: "fp-10",
    name: "2-In-1 Stainless Steel Card Holder & Metal Ball Pen",
    price: 0,
    image: "/images/featuredProducts/fp-10/hold.jpeg",
    images: ["/images/featuredProducts/fp-10/hold.jpeg"],
    brand: "uphaar",
    badge: "Featured",
    features: [
      "Premium stainless steel construction",
      "Sleek metal ball pen with smooth writing performance",
      "Slim stainless steel card holder for business or credit cards",
      "Polished and professional finish",
      "Comes in an elegant gift box",
      "Custom logo branding available",
      "Ideal for corporate gifting and professionals",
      "4 colour options available"
    ]
  }
];

export const uphaarCollection: Product[] = [
  {
    id: "up-01",
    name: "Tipping T-Shirts",
    price: 550,
    image: "/images/uphaar/up-01/t-shirt1.png",
    images: [
      "/images/uphaar/up-01/t-shirt1.png",
      "/images/uphaar/up-01/t-shirt2.jpeg",
      "/images/uphaar/up-01/t-shirt3.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Made from Duranit cotton fabric",
      "260 GSM premium quality",
      "Colour-fast, soft-flow dyed fabric",
      "Pre-shrunk for better fit retention",
      "Ribbed collar with Lycra",
      "3-button placket",
      "Double-needle stitching",
      "Side slits for added comfort"
    ],
    customizationForm: [
      {
        name: "size",
        label: "Select Size",
        type: "select",
        required: true,
        options: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"]
      },
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "Red with White",
          "Navy Blue with White",
          "Grey Melange with Black",
          "Royal Blue with White",
          "Brown with White",
          "White with Red",
          "Black with Red",
          "White with Royal Blue",
          "Apple Green with White",
          "Turquoise with White",
          "Turquoise Blue with White",
          "Black with White",
          "Yellow with Black",
          "Orange with White",
          "Electric Blue with White",
          "Purple with White",
          "Grey Melange with Red",
          "Charcoal Grey with White",
          "Maroon with White",
          "Beige with White",
          "Teal with White"
        ]
      }
    ]
  },
  {
    id: "up-02",
    name: "Polo T-Shirts",
    price: 480,
    image: "/images/uphaar/up-02/plain1.jpeg",
    images: [
      "/images/uphaar/up-02/plain1.jpeg",
      "/images/uphaar/up-02/plain2.jpeg",
      "/images/uphaar/up-02/plain3.png",
      "/images/uphaar/up-02/plain4.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Made from comfortable cotton fabric",
      "Classic polo neck design",
      "230 GSM fabric weight",
      "Half sleeves with regular fit",
      "Solid pattern with corporate styling",
      "Suitable for team uniforms and sports clubs",
      "Ideal for corporate giveaways and branding",
      "Comfortable for everyday casual wear"
    ],
    customizationForm: [
      {
        name: "size",
        label: "Select Size",
        type: "select",
        required: true,
        options: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"]
      },
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "White",
          "Black",
          "Navy Blue",
          "Grey",
          "Royal Blue",
          "Red",
          "Maroon",
          "Dark Green",
          "Parrot Green",
          "Brown",
          "Light Blue",
          "Lemon Yellow"
        ]
      }
    ]
  },
  {
    id: "up-03",
    name: "Diary & Pen Set",
    price: 590,
    image: "/images/uphaar/up-03/diary1.jpeg",
    images: [
      "/images/uphaar/up-03/diary1.jpeg",
      "/images/uphaar/up-03/diary2.png",
      "/images/uphaar/up-03/diary3.jpg"
    ],
    brand: "uphaar",
    features: [
      "2-in-1 gift set with diary and metal pen",
      "A5 size notebook",
      "Elegant and professional finish",
      "Ideal for corporate gifting",
      "Suitable for staff and employee giveaways",
      "Perfect for office and promotional use"
    ],
    customizationForm: [
      {
        name: "diaryType",
        label: "Select Diary Type",
        type: "select",
        required: true,
        options: [
          "Sr 138", "Sr 139", "Sr 140", "Sr 141", "Sr 145", "Sr 146",
          "Sr 217", "Sr 218", "Sr 219", "Sr 267", "Sr 268", "Sr 269",
          "Sr 270", "Sr 273", "Sr 274", "Sr 275", "Sr 276", "Sr 277"
        ]
      }
    ]
  },
  {
    id: "up-8560",
    name: "Bottles",
    price: 800,
    image: "/images/uphaar/up-04/bot1.jpeg",
    images: [
      "/images/uphaar/up-04/bot1.jpeg",
      "/images/uphaar/up-04/bot2.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Double-wall stainless steel construction",
      "Durable and premium-quality material",
      "Leak-proof cap design",
      "Available in multiple bottle styles and finishes",
      "Capacity range from 500 ml to 900 ml",
      "Packed in a white gift box",
      "Customisable with name or company logo",
      "Ideal for corporate gifting and promotions"
    ],
    customizationForm: [
      {
        name: "bottleType",
        label: "Select Bottle Type",
        type: "select",
        required: true,
        options: [
          "BOT 02 – Black Temperature Bottle",
          "BOT 03 – White Temperature Bottle",
          "BOT 04 – Red Temperature Bottle",
          "BOT 05 – Blue Temperature Bottle",
          "BOT 07 – Vacuum Insulated Bottle",
          "BOT 08 – White Steel Bottle",
          "BOT 09 – Black Steel Bottle",
          "BOT 15 – Sporty Bottle (Black)",
          "BOT 16 – Sporty Bottle (White)",
          "BOT 17 – Sporty Bottle (Red)",
          "BOT 18 – Sporty Bottle (Blue)",
          "BOT 19 – Vacuum Bottle with Cup (Black)",
          "BOT 20 – Vacuum Bottle with Cup (White)",
          "BOT 21 – Black Non-Temperature Bottle",
          "BOT 22 – White Non-Temperature Bottle",
          "BOT 30 – Vacuum Flask (Black)",
          "BOT 31 – Steel Bottle",
          "BOT 32 – Vacuum Flask (Blue)",
          "BOT 33 – Vacuum Flask (Black with Strap)",
          "BOT 35 – Vacuum Flask (Bamboo Lid)"
        ]
      }
    ]
  },
  {
    id: "up-3283",
    name: "Mugs",
    price: 400,
    image: "/images/uphaar/up-05/mug1.png",
    images: [
      "/images/uphaar/up-05/mug1.png",
      "/images/uphaar/up-05/mug2.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Premium quality build",
      "Stainless steel inner lining (select variants)",
      "Dual-wall insulation for safe handling of hot beverages",
      "Comfortable and ergonomic design",
      "Made in India",
      "Affordable pricing",
      "Ideal for work-from-home and office use"
    ],
    customizationForm: [
      {
        name: "mugType",
        label: "Select Mug Type",
        type: "select",
        required: true,
        options: [
          "Mug 01 – Vacuum Coffee Mug with Push Button Lid (300 ml)",
          "Mug 02 – Steel Coffee Mug with Handle & Lid (350 ml)",
          "Mug 05 – Vacuum Coffee Mug with Push Button Lid (300 ml)",
          "Mug 06 – Vacuum Insulated Coffee Mug (400 ml)",
          "Mug 07 – Vacuum Insulated Coffee Mug – White (400 ml)",
          "Mug 11 – Steel Coffee Mug with Handle & Lid (300 ml)",
          "Mug 12 – Steel Coffee Mug with Handle & Lid (300 ml)",
          "Mug 13 – Steel Coffee Mug with Handle & Lid (300 ml)",
          "Mug 14 – Steel Coffee Mug with Handle & Lid (300 ml)",
          "Mug 15 – Steel Coffee Tumbler / Wine Flask with Lid (250 ml)",
          "Mug 16 – Steel Coffee Tumbler / Wine Flask with Lid (250 ml)",
          "Mug 17 – Coffee Mug made with Wheat Grains (300 ml)",
          "Mug 18 – Vacuum Mug with Lid & Steel Spoon (250 ml)",
          "Mug 19 – Coffee Mug with Temperature Display Lid (250 ml)",
          "Mug 20 – Bamboo Vacuum Coffee Mug (300 ml)",
          "Mug 21 – Borosilicate Coffee Mug with Cork Grip (250 ml)",
          "Mug 22 – Ceramic Mug with Lid & Cork Base (250 ml)",
          "Mug 23 – Ceramic Mug with Lid & Cork Base (250 ml)"
        ]
      }
    ]
  },
  {
    id: "up-06",
    name: "Metal Keychain",
    price: 490,
    image: "/images/uphaar/up-06/key1.png",
    images: [
      "/images/uphaar/up-06/key1.png",
      "/images/uphaar/up-06/key2.png"
    ],
    brand: "uphaar",
    features: [
      "High-quality metal construction",
      "Strong, rust-resistant and scratch-resistant finish",
      "Multiple keychain design options available",
      "Secure hook design for easy attachment",
      "Sleek and polished look",
      "Ideal for professionals, travellers, and gifting",
      "Optional gift box available at extra cost"
    ],
    customizationForm: [
      {
        name: "keychainType",
        label: "Select Keychain Type",
        type: "select",
        required: true,
        options: [
          "KC 01", "KC 02", "KC 03", "KC 04", "KC 06", "KC 07",
          "KC 08", "KC 09", "KC 10", "KC 11", "KC 12", "KC 13"
        ]
      }
    ]
  },
  {
    id: "up-8440",
    name: "Employee Joining Kit",
    price: 1200,
    image: "/images/uphaar/up-07/kit.png",
    images: [
      "/images/uphaar/up-07/kit1.png",
      "/images/uphaar/up-07/kit2.jpeg",
      "/images/uphaar/up-07/kit3.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Designed to create a strong first impression",
      "Curated essentials for new employees and business clients",
      "Each item individually PP-packed for premium presentation",
      "Custom branding available with company logo",
      "Ideal for executive corporate gifting and onboarding programs",
      "Suitable for HR welcome kits and promotional events",
      "Combines functionality with a professional, elegant look"
    ],
    customizationForm: [
      {
        name: "kitType",
        label: "Select Kit Type",
        type: "select",
        required: true,
        options: [
          "Kit Type 1", "Kit Type 2", "Kit Type 3", "Kit Type 4",
          "Kit Type 5", "Kit Type 6", "Kit Type 7", "Kit Type 8"
        ]
      }
    ]
  },
  {
    id: "up-08",
    name: "Pens",
    price: 190,
    image: "/images/uphaar/up-08/pen1.png",
    images: [
      "/images/uphaar/up-08/pen1.png",
      "/images/uphaar/up-08/pen2.jpeg",
      "/images/uphaar/up-08/pen3.jpeg",
      "/images/uphaar/up-08/pen4.jpeg",
      "/images/uphaar/up-08/pen5.jpeg",
      "/images/uphaar/up-08/pen6.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Ballpoint pen with blue ink",
      "Slim and lightweight design",
      "Smooth writing for daily office use",
      "Professional corporate finish",
      "Ideal for corporate gifting and promotions",
      "Custom engraving available for company name or logo"
    ],
    customizationForm: [
      {
        name: "penType",
        label: "Select Pen Type",
        type: "select",
        required: true,
        options: [
          "MP 01 – Escort", "MP 02 – Cross SP", "MP 03 – Titan Gold", "MP 05 – Creta Chrome",
          "MP 06 – Sigma Roller", "MP 08 – Creta Gold", "MP 09 – Roseberry", "MP 10 – Rosegold Carbon",
          "MP 12 – Radius", "MP 13 – Cross CP", "MP 14 – Vermont", "MP 15 – Cisco", "MP 16 – Lenovo",
          "MP 17 – Titan Chrome", "MP 18 – Champion", "MP 19 – Alpenlibe", "MP 21 – White Volkswagen",
          "MP 22 – 517 Roller", "MP 27 – Titan Blue", "MP 28 – Titan Red", "MP 29 – Creta Black",
          "MP 32 – Green Stone", "MP 39 – Black Cross Ball Pen", "MP 41 – Parker Roller",
          "MP 42 – Parker Silver-Gold", "MP 43 – 517 White Roller", "P1 – Basic Black", "P2 – Basic Red",
          "P3 – Basic Blue", "P8 – Gripper Red", "P9 – Gripper Black", "P10 – Gripper Blue",
          "P13 – Style Red", "P21 – Twist", "P27 – Space White", "P28 – Space Dark Blue",
          "P29 – Matty White", "P30 – Matty Black", "P31 – Triangle Black", "P32 – Triangle White",
          "P33 – Curve Blue", "P34 – Curve Red", "P35 – Probo", "P36 – Probo Black", "P37 – Prada White",
          "P38 – Prada Black", "P41 – Tissot White", "P42 – Mercedes", "P43 – Metal Bullet Black",
          "P44 – Metal Bullet Red", "P45 – Metal Bullet Blue", "P46 – Metal Slim Stylus",
          "P51 – Bosch Red", "P52 – Bosch Light Grey", "P53 – Bosch Sky Blue", "P55 – Garrex Black",
          "P56 – Texpin Blue", "P57 – Texpin Red", "P58 – Cool Black", "P59 – Cool Red",
          "P60 – Cool Blue", "P61 – Soft Black", "P62 – Soft Grey", "P63 – Red Square",
          "P64 – White Square", "P65 – Blue Square", "P66 – Black Square", "P67 – Black Glow",
          "P68 – Red Glow", "P69 – Blue Glow", "P70 – Obsidian Black", "P71 – Obsidian Blue",
          "P72 – Navigator White", "P73 – Navigator Red", "P74 – Navigator Blue",
          "P75 – Navigator Black Gold", "P77 – Nature Touch Bamboo Pen", "P78 – Clicksy (Mix Color)",
          "MP 109 – Magnet Wire Gold", "MP 110 – Magnet Wire Rose Gold", "MP 111 – Magnet Wire Chrome",
          "MP 112 – Magnet Gold", "MP 113 – Magnet Rose Gold", "MP 114 – Magnet Design Gold"
        ]
      }
    ]
  },
  {
    id: "up-09",
    name: "Jute Bags",
    price: 790,
    image: "/images/uphaar/up-09/jute1.png",
    images: [
      "/images/uphaar/up-09/jute1.png",
      "/images/uphaar/up-09/jute4.jpeg",
      "/images/uphaar/up-09/jute2.jpeg",
      "/images/uphaar/up-09/jute3.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Made from natural jute material",
      "Natural colour finish",
      "Short dyed cotton cord handles",
      "Durable and eco-friendly",
      "Customizable with name or company logo",
      "Suitable for embroidery or printing",
      "Ideal for promotional and corporate use"
    ],
    customizationForm: [
      {
        name: "juteBagType",
        label: "Select Jute Bag Type",
        type: "select",
        required: true,
        options: [
          "CT 01 – Cotton Tote Bag (300 GSM)", "CT 02 – Cotton Tote Bag (300 GSM)",
          "CT 03 – Cotton Tote Bag with Zipper", "CT 04 – Cotton Tote Bag with Zipper",
          "CT 05 – Simple Cotton Tote Bag (150 GSM)", "JB 02 – Medium Jute Bag",
          "JB 03 – Large Jute Bag", "JB 04 – Zipper Jute Bag (Small)", "JB 05 – Zipper Jute Bag (Big)",
          "JB 06 – Jute Bag with Window (6 × 8 × 4 inches)", "JB 07 – Jute Bag with Window (8 × 10 × 5 inches)",
          "JB 08 – Jute Bag with Window (12 × 12 × 6 inches)", "JB 09 – White Jute Bag (Long Handle)",
          "JB 10 – Black Jute Bag (Long Handle)", "JCZB 01 – Cotton-Jute Hand Pouch (Small)",
          "JCZB 02 – Cotton-Jute Hand Pouch (Big)", "DSB 01 – Drawstring Bag (White)", "DSB 02 – Drawstring Bag (Black)"
        ]
      }
    ]
  },
  {
    id: "up-10",
    name: "Faux Leather Travel Gift Set",
    price: 950,
    image: "/images/uphaar/up-10/faux1.png",
    images: [
      "/images/uphaar/up-10/faux1.png",
      "/images/uphaar/up-10/faux2.jpeg",
      "/images/uphaar/up-10/faux3.jpeg",
      "/images/uphaar/up-10/faux4.jpeg"
    ],
    brand: "uphaar",
    features: [
      "Complete travel essentials curated in one premium set",
      "Includes travel kit, diary, passport cover, eyewear case, mini tags, keychain, and more",
      "Made from premium synthetic vegan leather",
      "Stylish, functional, and travel-friendly design",
      "Ideal for frequent travellers and globe-trotters",
      "Perfect for corporate gifting and employee travel kits"
    ]
  }
];

export const kyddozCollection: Product[] = [
  {
    id: "ky-01",
    name: "Embroidered Personalised Egyptian Wonder Towels",
    price: 850,
    image: "/images/kyddoz/kd-01/towel1.jpeg",
    images: [
      "/images/kyddoz/kd-01/towel1.jpeg",
      "/images/kyddoz/kd-01/towel3.jpeg",
      "/images/kyddoz/kd-01/towel2.png"
    ],
    brand: "kyddoz",
    features: [
      "Egyptian Wonder premium towel collection",
      "450–550 GSM for plush comfort and high absorbency",
      "Made from 100% soft, breathable cotton",
      "Lightweight and gentle on the skin",
      "Customised with name or initials (fine embroidery)",
      "Please note: Rates differ w.r.t size"
    ],
    sizes: [
      { label: "Bath Sheet", size: "33×66 inches" },
      { label: "Men’s Towel", size: "30×60 inches" },
      { label: "Ladies / Kid’s Towel", size: "24×48 inches" },
      { label: "Gym / Salon Towel", size: "20×40 inches" },
      { label: "Hand Towel", size: "16×24 inches" },
      { label: "Face Towel", size: "12×12 inches" }
    ],
    customizationForm: [
      {
        name: "size",
        label: "Select Size",
        type: "select",
        required: true,
        options: [
          "Bath Sheet (33×66\")", "Men’s Towel (30×60\")", "Ladies / Kid’s Towel (24×48\")",
          "Gym / Salon Towel (20×40\")", "Hand Towel (16×24\")", "Face Towel (12×12\")"
        ]
      },
      {
        name: "customName",
        label: "Custom Name",
        type: "text",
        placeholder: "Enter name to embroider",
        required: true
      },
      {
        name: "color",
        label: "Select Towel Colour",
        type: "select",
        required: true,
        options: [
          "White", "Banana", "MD. Blue", "Brown", "Navy Blue", "Royal Blue",
          "Charcoal", "Black", "Petrol Blue", "Rust", "Maroon", "Purple",
          "Pink", "Peach", "Beige"
        ]
      }
    ]
  },
  {
    id: "ky-02",
    name: "Personalised Children’s Wooden Gibly Door Plate",
    price: 490,
    image: "/images/kyddoz/kd-02/plate2.png",
    images: [
      "/images/kyddoz/kd-02/plate2.png",
      "/images/kyddoz/kd-02/plate1.png",
      "/images/kyddoz/kd-02/plate3.png",
      "/images/kyddoz/kd-02/plate4.png",
    ],
    brand: "kyddoz",
    features: [
      "Made from high-quality MDF",
      "Thickness: 5 mm",
      "Pre-applied 2-way tape for easy mounting",
      "Suitable for any flat surface",
      "Dimensions: 9 × 5 inches",
      "Personalised with child’s name",
      "Design number selection available",
      "Image to be shared on WhatsApp after checkout"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Child’s Name",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: ["Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6"]
      }
    ]
  },
  {
    id: "ky-03",
    name: "Personalised Steel Sipper",
    price: 690,
    image: "/images/kyddoz/kd-03/bottle1.jpeg",
    images: [
      "/images/kyddoz/kd-03/bottle1.jpeg",
      "/images/kyddoz/kd-03/bottle2.png",
      "/images/kyddoz/kd-03/bottle3.png"
    ],
    brand: "kyddoz",
    features: [
      "Capacity: 600 ml",
      "High-quality stainless steel",
      "Cute and colorful prints",
      "Personalised with child’s name",
      "Durable and eco-friendly",
      "Safe for everyday use",
      "Ideal for school, travel, and gifting"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Print",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6",
          "Design 7", "Design 8", "Design 9", "Design 10", "Design 11", "Design 12"
        ]
      }
    ]
  },
  {
    id: "ky-04",
    name: "Personalised Veigo 7-Piece Lunch Box Set",
    price: 1700,
    image: "/images/kyddoz/kd-04/tiffin1.jpeg",
    images: [
      "/images/kyddoz/kd-04/tiffin1.jpeg",
      "/images/kyddoz/kd-04/tiffin2.jpeg",
      "/images/kyddoz/kd-04/tiffin3.jpeg",
      "/images/kyddoz/kd-04/tiffin4.jpeg"
    ],
    brand: "kyddoz",
    features: [
      "Jumbo box capacity: 950 ml",
      "Large box with vegetable compartment: 810 ml",
      "Main compartment: 630 ml",
      "Vegetable compartment: 180 ml",
      "Medium box capacity: 330 ml",
      "Includes cutlery: spoon & fork",
      "Ideal for school, travel, and daily meals",
      "Personalised with name and design number"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Print",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6",
          "Design 7", "Design 8", "Design 9", "Design 10", "Design 11", "Design 12",
          "Design 13", "Design 14", "Design 15", "Design 16", "Design 17", "Design 18"
        ]
      }
    ]
  },
  {
    id: "ky-05",
    name: "2-Layered Acrylic Name Keychain",
    price: 230,
    image: "/images/kyddoz/kd-05/keychain1.jpeg",
    images: [
      "/images/kyddoz/kd-05/keychain1.jpeg",
      "/images/kyddoz/kd-05/keychain2.jpeg"
    ],
    brand: "kyddoz",
    features: [
      "Made from high-quality acrylic",
      "Dimensions: 80 mm × 30 mm",
      "2-layered name cutout design",
      "Available in 14 color options",
      "Lightweight and durable",
      "Perfect for everyday use and gifting"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Engrave",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink",
          "Purple", "Orange", "Brown", "Grey", "Gold", "Silver", "Transparent"
        ]
      }
    ]
  },
  {
    id: "ky-06",
    name: "Personalised Thali Set",
    price: 650,
    image: "/images/kyddoz/ky-06/thali1.jpeg",
    images: [
      "/images/kyddoz/ky-06/thali1.jpeg",
      "/images/kyddoz/ky-06/thali2.jpeg",
      "/images/kyddoz/ky-06/des1.jpeg",
      "/images/kyddoz/ky-06/des2.jpeg"
    ],
    brand: "kyddoz",
    features: [
      "Personalized stainless steel thali set",
      "Permanent laser engraving",
      "Premium quality stainless steel",
      "Odorless & food-safe",
      "Sturdy and durable",
      "Easy to clean",
      "Ideal for kids",
      "Perfect gifting option"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Engrave",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6",
          "Design 7", "Design 8", "Design 9", "Design 10", "Design 11", "Design 12",
          "Design 13", "Design 14", "Design 15", "Design 16", "Design 17", "Design 18"
        ]
      },
      {
        name: "thaliType",
        label: "Select Thali Type",
        type: "select",
        required: true,
        options: ["Round Thali", "3-Partition Thali"]
      }
    ]
  },
  {
    id: "ky-07",
    name: "Personalised Travel Set",
    price: 890,
    image: "/images/kyddoz/ky-07/travel1.jpeg",
    images: [
      "/images/kyddoz/ky-07/travel1.jpeg",
      "/images/kyddoz/ky-07/travel2.png",
      "/images/kyddoz/ky-07/travel3.png"
    ],
    brand: "kyddoz",
    features: [
      "Plush fibre filling for maximum comfort",
      "Ergonomic neck support to prevent strain",
      "Premium-quality fabric for cozy naps",
      "Soft eye mask that blocks light effectively",
      "Gentle on skin, suitable for long journeys",
      "Durable and lightweight MDF bag tag",
      "Personalised name for easy luggage identification",
      "Ideal for travel and gifting"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Print",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6",
          "Design 7", "Design 8", "Design 9", "Design 10", "Design 11", "Design 12",
          "Design 13", "Design 14", "Design 15", "Design 16", "Design 17", "Design 18"
        ]
      }
    ]
  },
  {
    id: "ky-08",
    name: "Personalised Piano Folder",
    price: 480,
    image: "/images/kyddoz/ky-08/folder1.png",
    images: [
      "/images/kyddoz/ky-08/folder1.png",
      "/images/kyddoz/ky-08/folder2.png",
      "/images/kyddoz/ky-08/folder3.png"
    ],
    brand: "kyddoz",
    features: [
      "Personalised with name for easy identification",
      "Expandable design with 12 partitions",
      "Ideal for school worksheets, drawings, and assignments",
      "Suitable for medical records or office documents",
      "Durable plastic material",
      "Lightweight and easy to carry",
      "Available in assorted kid-friendly designs"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name to Print",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5",
          "Design 6", "Design 7", "Design 8", "Design 9"
        ]
      }
    ]
  },
  {
    id: "ky-09",
    name: "Back To School Hamper",
    price: 650,
    image: "/images/kyddoz/ky-09/school1.png",
    images: [
      "/images/kyddoz/ky-09/school1.png",
      "/images/kyddoz/ky-09/school3.jpeg"
    ],
    brand: "kyddoz",
    features: [
      "Complete stationery hamper with everyday essentials",
      "Includes 60 waterproof stickers",
      "64 stamp-size stickers",
      "42 school labels",
      "40 stationery stickers",
      "25 gift cards",
      "2 bag tags",
      "Available in multiple prints",
      "Encourages kids to label and organize school supplies",
      "Personalised gift box ideal for back-to-school, birthdays, and return gifts"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name",
        type: "text",
        placeholder: "Enter name",
        required: true
      },
      {
        name: "designNumber",
        label: "Select Design Number",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5",
          "Design 6", "Design 7", "Design 8", "Design 9"
        ]
      }
    ]
  },
  {
    id: "ky-10",
    name: "Personalised Duffle Bags",
    price: 550,
    image: "/images/kyddoz/ky-10/duffle1.jpeg",
    images: [
      "/images/kyddoz/ky-10/duffle1.jpeg",
      "/images/kyddoz/ky-10/duffle2.png",
      "/images/kyddoz/ky-10/duffle3.jpg"
    ],
    brand: "kyddoz",
    features: [
      "Made from premium transparent jelly material with glossy neon finish",
      "Customisable with full name or single initial and one charm",
      "Stylish 3D patches on the front",
      "Spacious main compartment for books, toys, or clothes",
      "Lightweight, durable, and easy to clean",
      "Ideal for school, day trips, and everyday use",
      "Dimensions: 15 × 9 × 6.5 inches",
      "Available in neon colour options",
      "Personalisation charges apply for extra letters or elements"
    ],
    customizationForm: [
      {
        name: "customName",
        label: "Name / Initial",
        type: "text",
        placeholder: "Enter name or initial",
        required: true
      },
      {
        name: "color",
        label: "Select Colour",
        type: "select",
        required: true,
        options: [
          "Neon Pink", "Neon Blue", "Neon Sky Blue", "Neon Yellow", "Neon Purple"
        ]
      },
      {
        name: "element",
        label: "Charm",
        type: "select",
        required: true,
        options: [
          "Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6",
          "Design 7", "Design 8", "Design 9", "Design 10", "Design 11", "Design 12",
          "Design 13", "Design 14", "Design 15", "Design 16", "Design 17", "Design 18",
          "Design 19", "Design 20", "Design 21", "Design 22", "Design 23", "Design 24",
          "Design 25", "Design 26", "Design 27", "Design 28", "Design 29", "Design 30"
        ]
      }
    ]
  }
];


export const festiveCollection: Product[] = [
  {
    id: "fpick-01",
    name: "Silver Festive Hamper",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    brand: "festive",
    badge: "Editor’s Pick",
  },
  {
    id: "fpick-02",
    name: "Saffron Almond Box",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80",
    brand: "festive",
  },
  {
    id: "fpick-03",
    name: "Rose Pistachio Truffles",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    brand: "festive",
  }
];

export const uphaarHeroSlides = [
  "/images/hero/up/5.png",
  "/images/hero/up/6.png",
  "/images/hero/up/7.png",
];

export const kyddozHeroSlides = [
  "/images/hero/ky/1.png",
  "/images/hero/ky/2.png",
  "/images/hero/ky/3.png",
];

export const festiveHeroSlides = [
  "https://images.unsplash.com/photo-1481391478347-8c5f710ff0ac?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1600&q=80",
];
