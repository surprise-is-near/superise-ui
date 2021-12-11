import React, { useState } from 'react';
import Card from "~/components/Card"
import { useParams } from 'react-router-dom';
import Assets from '~/components/account/assets';
import fakedata from '~/fakedata/account.json';
import {REF_FARM_CONTRACT_ID, wallet} from "~services/near";
import { PrimaryButton } from '~/components/button/Button'
import TokenAmount from '~components/forms/TokenAmount';
import { nearMetadata, TokenMetadata } from '~domain/near/ft/models';
import PrizePoolGallary from '~components/prize/prize-pool-gallery'
import CenterWrap from '~components/layout/center-wrap';
import {
  useDepositableBalance,
  useFtAssets,
  useTokenBalances,
  useUserRegisteredTokens,
  useWhitelistTokens
} from "~state/token";
import {wrapNear} from "~domain/near/wrap-near";
import {deposit_ft} from "~domain/superise/methods";
import {useAccountHistory} from '~state/prize';
import RequestSigninModal from '~components/modal/request-signin-modal';



export function AccountPage() {
  const isSignedIn = wallet.isSignedIn();
  if (!isSignedIn) return <RequestSigninModal text="Connect to NEAR wallet first before visiting the account page." />

  const { id } = useParams< { id: string }>();
  const [amount, setAmount] = useState<string>('');
  const balances = useTokenBalances();
  const ftAssets = useFtAssets();
  const historyPools = useAccountHistory();
  console.log({ historyPools })

  // max should get from the balance from when switching tokens, now just get
  // it from the fakedata.tokenListData
  // const selectedTokenBlanceOnNear = fakedata.tokenListData.find((item:any) => item.id === selectedToken.id).near;
  // const max = `${selectedTokenBlanceOnNear}`

  const userTokens = useUserRegisteredTokens();
  const tokens = useWhitelistTokens();
  const [selectedToken, setSelectedToken] = useState<TokenMetadata>(
      id && tokens ? tokens.find((tok: any) => tok.id === id) : nearMetadata
  );
  const max = useDepositableBalance(selectedToken?.id, selectedToken?.decimals);

  const handleDeposit = () => {
    // TODO: call API with amount and selectedToken;
    if(selectedToken.id === nearMetadata.id) {
      return wrapNear(amount);
    }
    deposit_ft({token: selectedToken,amount})
  }

  return <CenterWrap>
    <Assets tokens={tokens} balances={ftAssets} />
    <div className="mt-8" />
    <Card title="Deposit">
        <TokenAmount
          amount={amount}
          max={max}
          total={max}
          tokens={[nearMetadata, ...tokens]}
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
          onChangeAmount={setAmount}
          text={selectedToken.symbol}
          balances={balances}
        />
      {wallet.isSignedIn() ? (
          <PrimaryButton isFull onClick={handleDeposit}>Deposit</PrimaryButton>
      ) : (
        <div>
          <PrimaryButton isFull onClick={() => {wallet.requestSignIn(REF_FARM_CONTRACT_ID)}}>Connect to Near</PrimaryButton>
        </div>
      )}
    </Card>
    <div className="mt-8" />
    <Card title="History">
      <PrizePoolGallary pools={historyPools} />
    </Card>
    <div className="mt-8">
      <PrimaryButton onClick={async () => {
        wallet.signOut();
        window.location.assign('/');
      }}>Sign out</PrimaryButton>
    </div>
  </CenterWrap>

}
