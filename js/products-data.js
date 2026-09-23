/**
 * SREE KRISHNA ENTERPRIZES - PRODUCT DATA REPOSITORY
 * Admin-ready architecture: Decoupled data model for easy CMS/API integration.
 */

window.SKE_PRODUCTS = [
  {
    id: "ske-cat-01",
    name: "High-Speed Rapier Weaving Loom",
    category: ["new-looms", "used-looms"],
    categoryLabel: "New & Used Looms",
    condition: "new-used",
    conditionLabel: "New & Used",
    badgeClass: "badge-new-used",
    image: "assets/images/rapier-loom.jpg?v=10",
    shortDescription: "Precision electronic rapier loom supplied in brand new factory-direct condition or thoroughly inspected used configurations.",
    specifications: {
      "Application": "Shirting, Suiting, Home Textiles",
      "Weft Insertion": "Flexible / Rigid Rapier System",
      "Working Width": "190 cm - 360 cm (Configurable)",
      "Condition": "Available New & Used (Inspected)",
      "Availability": "Based on Customer Requirement & Order"
    },
    availability: "Available on Order (New & Used)"
  },
  {
    id: "ske-cat-02",
    name: "High-Speed Air-Jet Loom",
    category: ["new-looms", "used-looms"],
    categoryLabel: "New & Used Looms",
    condition: "new-used",
    conditionLabel: "New & Used",
    badgeClass: "badge-new-used",
    image: "assets/images/airjet-loom.png?v=10",
    shortDescription: "High-efficiency air-jet weaving loom available in brand-new high-speed models or thoroughly inspected used configurations.",
    specifications: {
      "Application": "High-volume Cotton & Denim Weaving",
      "Condition": "Available New & Used (Inspected)",
      "Shedding Motion": "Electronic Dobby / Cam Option",
      "Availability": "Subject to Current Stock & Inspection"
    },
    availability: "Stock Available / On Request"
  },
  {
    id: "ske-cat-03",
    name: "Projectile Loom",
    category: ["new-looms", "used-looms", "imported-machinery"],
    categoryLabel: "New & Used Looms",
    condition: "new-used",
    conditionLabel: "New & Used",
    badgeClass: "badge-new-used",
    image: "assets/images/projectile-loom.jpg?v=10",
    shortDescription: "Heavy-duty projectile weaving loom available in brand-new and inspected used conditions for technical textiles and wide-width fabrics.",
    specifications: {
      "Application": "Technical Textiles, Wide Width Fabrics, Denim & Canvas",
      "Weft Insertion": "Gripper Projectile System",
      "Working Width": "190 cm - 540 cm (Configurable)",
      "Condition": "Available New & Used (Imported)",
      "Control": "Digital Touchscreen Controller Interface",
      "Availability": "Supplied on Project Specification"
    },
    availability: "Direct Import on Requirement"
  },
  {
    id: "ske-cat-04",
    name: "High-Speed Sizing Machine",
    category: ["new-looms", "used-looms", "imported-machinery", "sizing"],
    categoryLabel: "SIZING",
    condition: "new-used",
    conditionLabel: "SIZING",
    badgeClass: "badge-new-used",
    image: "assets/images/sizing-machine.jpg?v=2",
    shortDescription: "High-performance warp yarn sizing machine for precision sizing coating, multi-cylinder drying, and weaver's beam winding.",
    specifications: {
      "Application": "Warp Yarn Sizing & Weaver's Beam Preparation",
      "Machine Type": "High-Speed Warp Sizing (Slasher)",
      "Working Width": "180 cm - 360 cm (Configurable)",
      "Condition": "Available New & Used (Imported)",
      "Drying System": "Multi-Cylinder Steam / Thermal Oil Drying",
      "Control": "PLC Automatic Tension & Moisture Controller",
      "Availability": "Supplied on Requirement & Order"
    },
    availability: "Available on Order (New & Used)"
  },
  {
    id: "ske-cat-05",
    name: "High-Speed Ring Spinning Machine",
    category: ["new-looms", "used-looms", "imported-machinery", "spinning"],
    categoryLabel: "SPINNING",
    condition: "new-used",
    conditionLabel: "SPINNING",
    badgeClass: "badge-new-used",
    image: "assets/images/spinning-machine.jpg?v=1",
    shortDescription: "High-efficiency ring spinning machine designed for high spindle speeds, superior yarn count consistency, and energy-saving textile production.",
    specifications: {
      "Application": "Cotton, Synthetic & Blended Yarn Spinning",
      "Machine Type": "High-Speed Ring Spinning Frame",
      "Drafting System": "Precision Multi-Roller Drafting Geometry",
      "Condition": "Available New & Used (Imported)",
      "Control System": "Touchscreen PLC Inverter Drive Control",
      "Availability": "Supplied on Requirement & Order"
    },
    availability: "Available on Order (New & Used)"
  },
  {
    id: "ske-cat-06",
    name: "High-Speed Sectional Warping Machine",
    category: ["new-looms", "used-looms", "imported-machinery", "warping"],
    categoryLabel: "WARPING",
    condition: "new-used",
    conditionLabel: "WARPING",
    badgeClass: "badge-new-used",
    image: "assets/images/warping-machine.jpg?v=1",
    shortDescription: "High-precision warping machine with intelligent tension control, high-capacity yarn creel, and uniform beam density for seamless weaving preparation.",
    specifications: {
      "Application": "Direct & Sectional Warp Preparation for Weaving",
      "Machine Type": "High-Speed Automatic Warping Machine",
      "Warping Speed": "Up to 1000 m/min (Precision Inverter Controlled)",
      "Beam Width": "Configurable Flange Widths (180 cm - 360 cm)",
      "Condition": "Available New & Used (Imported)",
      "Creel System": "High-Capacity Creel with Auto Stop Motion",
      "Control System": "PLC Touchscreen with Laser Length & Tension Monitoring",
      "Availability": "Supplied on Requirement & Order"
    },
    availability: "Available on Order (New & Used)"
  }
];

window.SKE_ACCESSORY_CATEGORIES = [
  {
    title: "Weaving Accessories",
    desc: "Imported textile weaving accessories and components for seamless mill operations.",
    tags: ["Drop Wires", "Heald Wires", "Reed Blades", "Temple Cylinders"],
    icon: "loom"
  },
  {
    title: "Loom Components",
    desc: "Essential mechanical and electronic sub-assemblies for shuttleless and shuttle looms.",
    tags: ["Gripper Bodies", "Cams & Levers", "Drive Gears", "Tension Rollers"],
    icon: "gear"
  },
  {
    title: "Machinery Parts",
    desc: "Precision-engineered replacement parts designed for durability under 24/7 industrial production.",
    tags: ["Shafts & Bearings", "Clutch Assemblies", "Brake Discs", "Guide Plates"],
    icon: "tool"
  },
  {
    title: "Replacement Components",
    desc: "Standardized consumable parts for regular preventive and reactive machinery maintenance.",
    tags: ["Yarn Cutters", "Nozzles", "Solenoid Valves", "Timing Belts"],
    icon: "refresh"
  },
  {
    title: "Textile Machinery Accessories",
    desc: "Ancillary equipment and fittings to support weaving, preparation, and fabric rolling.",
    tags: ["Beam Flanges", "Cloth Winders", "Selvedge Units", "Stop Motions"],
    icon: "layers"
  },
  {
    title: "Industrial Components",
    desc: "High-grade industrial components sourced globally to support textile processing machinery.",
    tags: ["Pneumatics", "Electronic Sensors", "Drives & Inverters", "Control Cards"],
    icon: "cpu"
  }
];
