import { DiscountType } from "./index.js";

/**
 *
 * @param {number} price  - number
 * @param {object} discount  - {amount: number, type: string}
 * @returns  number - calculated price
 * @description  calculate the product price based on the discount type and amount
 */
export const calculateProductPrice = (price, discount) => {
  let appliedPrice = price;

  if (discount.type === DiscountType.PERCENTAGE) {
    appliedPrice = price - (price * discount.amount) / 100;
  } else if (discount.type === DiscountType.FIXED) {
    appliedPrice = price - discount.amount;
  }

  return appliedPrice;
};
