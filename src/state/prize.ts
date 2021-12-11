import { TokenMetadata } from "~domain/near/ft/models";
import { useEffect, useState } from "react";
import { getWhitelistedTokens } from "~domain/ref/methods";
import { ftGetTokenMetadata } from "~domain/near/ft/methods";
import { PrizePool, PrizePoolDisplay } from "~domain/superise/models";
import {
  view_prize_pool,
  view_prize_pool_list,
  view_user_pool,
} from "~domain/superise/methods";
import { wallet } from "~domain/near/global";

export const usePrizePoolDisplayLists = (): PrizePoolDisplay[] => {
  const [prizePoolDisplay, setPrizePoolDisplay] =
    useState<PrizePoolDisplay[]>();

  useEffect(() => {
    view_prize_pool_list().then(setPrizePoolDisplay);
  }, []);

  return prizePoolDisplay;
};

export const usePrizePool = (pool_id: number): PrizePool => {
  const [prizePool, setPrizePool] = useState<PrizePool>();

  useEffect(() => {
    view_prize_pool(pool_id).then(setPrizePool);
  }, []);

  return prizePool;
};

export const useAccountHistory = () => {
  const [history, setHistory] = useState<PrizePoolDisplay[]>();
  useEffect(() => {
    view_user_pool(wallet.getAccountId())
      .then(setHistory)
      .catch((e) => {
        setHistory([]);
      });
  }, []);
  return history;
};
