/** I1 ER diagram — sourced from service/app/models.py and service/app/converter.py */

export const ER_MERMAID = `erDiagram
    Currency {
        string code PK
    }
    ConvertRequest {
        float amount
        string from_currency FK
        string to_currency FK
    }
    ConvertResponse {
        float amount
        string from_currency
        string to_currency
        float converted_amount
        float rate
    }
    RATES {
        string from_currency PK
        string to_currency PK
        float multiplier
    }
    Currency ||--o{ ConvertRequest : "from_currency"
    Currency ||--o{ ConvertRequest : "to_currency"
    ConvertRequest ||--|| ConvertResponse : "produces"
    RATES ||--o{ ConvertRequest : "lookup by from and to"`;

export interface EntityField {
  field: string;
  type: string;
  primaryKey: boolean;
  source: string;
}

export interface EntityDefinition {
  name: string;
  kind: "enum" | "dto" | "lookup";
  storage?: string;
  fields: EntityField[];
}

export interface Relationship {
  from: string;
  to: string;
  type: string;
  source: string;
}

export const ENTITIES: EntityDefinition[] = [
  {
    name: "Currency",
    kind: "enum",
    fields: [
      { field: "USD", type: "enum value", primaryKey: true, source: "service/app/models.py L7" },
      { field: "EUR", type: "enum value", primaryKey: true, source: "service/app/models.py L8" },
      { field: "GBP", type: "enum value", primaryKey: true, source: "service/app/models.py L9" },
    ],
  },
  {
    name: "ConvertRequest",
    kind: "dto",
    fields: [
      { field: "amount", type: "float", primaryKey: false, source: "service/app/models.py L13" },
      { field: "from_currency", type: "Currency", primaryKey: false, source: "service/app/models.py L14 (alias from)" },
      { field: "to_currency", type: "Currency", primaryKey: false, source: "service/app/models.py L15 (alias to)" },
    ],
  },
  {
    name: "ConvertResponse",
    kind: "dto",
    fields: [
      { field: "amount", type: "float", primaryKey: false, source: "service/app/models.py L28" },
      { field: "from_currency", type: "Currency", primaryKey: false, source: "service/app/models.py L29" },
      { field: "to_currency", type: "Currency", primaryKey: false, source: "service/app/models.py L30" },
      { field: "converted_amount", type: "float", primaryKey: false, source: "service/app/models.py L31" },
      { field: "rate", type: "float", primaryKey: false, source: "service/app/models.py L32" },
    ],
  },
  {
    name: "RATES",
    kind: "lookup",
    storage: "dict[tuple[Currency, Currency], float] — service/app/converter.py L6",
    fields: [
      { field: "from_currency", type: "Currency", primaryKey: true, source: "service/app/converter.py L6 (key[0])" },
      { field: "to_currency", type: "Currency", primaryKey: true, source: "service/app/converter.py L6 (key[1])" },
      { field: "multiplier", type: "float", primaryKey: false, source: "service/app/converter.py L6–15" },
    ],
  },
];

export const RATE_ROWS = [
  { from: "USD", to: "EUR", rate: 0.92, source: "service/app/converter.py L7" },
  { from: "EUR", to: "USD", rate: 1.09, source: "service/app/converter.py L8" },
  { from: "USD", to: "GBP", rate: 0.79, source: "service/app/converter.py L9" },
  { from: "GBP", to: "USD", rate: 1.27, source: "service/app/converter.py L10" },
  { from: "EUR", to: "GBP", rate: 0.86, source: "service/app/converter.py L11" },
  { from: "GBP", to: "EUR", rate: 1.16, source: "service/app/converter.py L12" },
  { from: "USD", to: "USD", rate: 1.0, source: "service/app/converter.py L13" },
  { from: "EUR", to: "EUR", rate: 1.0, source: "service/app/converter.py L14" },
  { from: "GBP", to: "GBP", rate: 1.0, source: "service/app/converter.py L15" },
];

export const RELATIONSHIPS: Relationship[] = [
  {
    from: "ConvertRequest.from_currency",
    to: "RATES key[0]",
    type: "lookup",
    source: "service/app/converter.py L23",
  },
  {
    from: "ConvertRequest.to_currency",
    to: "RATES key[1]",
    type: "lookup",
    source: "service/app/converter.py L23",
  },
  {
    from: "ConvertRequest",
    to: "ConvertResponse",
    type: "derived (stateless)",
    source: "service/app/main.py L17–24",
  },
];

export const I1_NOTES = [
  "No SQL database — logical entities and in-memory RATES dict only.",
  "Same-currency pairs exist in RATES but POST /convert rejects from == to (service/app/converter.py L20–21).",
  "Markdown deliverable: docs/eval/intermediate/I1-er-diagram.md",
];
