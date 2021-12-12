import React from 'react';
import { PrimaryButton } from '~/components/button/Button'
import CenterWrap from '~/components/layout/center-wrap'
import { ArrowRight } from 'react-feather';
import PrizePoolList from '~components/prize/prize-pool-list';
import {useHistory} from 'react-router-dom';
import {usePrizePoolDisplayLists} from "~state/prize";
import PageLoading from '~components/page-loading';
import {useWhitelistTokens} from '~state/token';

export default function Index() {
  let history = useHistory();

  const handleClickPool = (id: number) => {
    history.push(`/box/${id}`);
  }

  let prizePoolDisplays = usePrizePoolDisplayLists();
  const tokens = useWhitelistTokens();

  if (!prizePoolDisplays || !tokens) return <PageLoading />

  return (
    <CenterWrap>
      <div className="my-8">
      <div className="mb-4 text-4xl font-black leading-10">
        <span className="text-purple-900">Create mystery box</span> <span className="text-blue-500">on NEAR protocol</span> <span className="text-green-400">with 100% transparency</span>
      </div>
      <PrimaryButton suffixIcon={<ArrowRight />} onClick={() => {
        history.push('/box/create');
      }}>Create a Box</PrimaryButton>
      </div>
      <PrizePoolList pools={prizePoolDisplays} onClickPool={handleClickPool} tokens={tokens} />
      {prizePoolDisplays && prizePoolDisplays.length > 5 && (
        <>
          <div className="mt-8"/>
          <PrimaryButton suffixIcon={<ArrowRight />} onClick={() => {
            history.push('/box/create');
          }}>Create a Box</PrimaryButton>
        </>
      )}
    </CenterWrap>
  )
}
