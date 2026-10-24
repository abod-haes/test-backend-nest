/**
 * Central list of available furniture color families.
 *
 * String enum values intentionally match existing SQLite Product.color
 * values so previously seeded products keep working without migration.
 */
export enum ProductColor {
  BLACK = 'Black',
  WHITE = 'White',
  GRAY = 'Gray',
  BEIGE = 'Beige',
  BROWN = 'Brown',
  BLUE = 'Blue',
  GREEN = 'Green',
  RED = 'Red',
  YELLOW = 'Yellow',
  PINK = 'Pink',
  ORANGE = 'Orange',
  PURPLE = 'Purple',
}

export const PRODUCT_COLOR_HEX: Record<ProductColor, string> = {
  [ProductColor.BLACK]: '#171717',
  [ProductColor.WHITE]: '#FFFFFF',
  [ProductColor.GRAY]: '#9CA3AF',
  [ProductColor.BEIGE]: '#D8C7A7',
  [ProductColor.BROWN]: '#8B5E3C',
  [ProductColor.BLUE]: '#3B82F6',
  [ProductColor.GREEN]: '#22A06B',
  [ProductColor.RED]: '#EF4444',
  [ProductColor.YELLOW]: '#FACC15',
  [ProductColor.PINK]: '#F472B6',
  [ProductColor.ORANGE]: '#FB923C',
  [ProductColor.PURPLE]: '#A855F7',
};

export const PRODUCT_COLOR_OPTIONS = Object.values(ProductColor).map(
  (value) => ({
    value,
    label: value,
    hex: PRODUCT_COLOR_HEX[value],
  }),
);
