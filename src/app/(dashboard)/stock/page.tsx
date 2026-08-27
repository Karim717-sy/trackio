import { getSupplies, getStockOverview } from "./actions";
import { getProductMarkets } from "../products/actions";
import StockClient from "./StockClient";

export default async function StockPage() {
  const supplies = await getSupplies();
  const markets = await getProductMarkets();
  const overview = await getStockOverview();

  return <StockClient supplies={supplies} markets={markets} overview={overview} />;
}
