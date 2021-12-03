import React, { useState } from 'react';
import Card from '~/components/Card'
import { toPrecision, toReadableNumber } from '~/utils/numbers';
import { toRealSymbol } from '~/utils/token';
import { TokenBalancesView, TokenMetadata } from '~domain/near/ft/models';
import { PrimaryButton } from '~components/button/Button';
import WithdrawModal from './withdraw-modal';

export function Token(props: TokenMetadata & { amount: string; totalAmount: string }) {
  const { symbol, icon, amount, totalAmount } = props;
  return (
    <div
      className="token flex items-center justify-between pt-3.5 pb-3.5 text-gray-700"
      title={totalAmount}
    >
      <div className="flex items-center">
        {icon ? (
          <img
            className="h-6 w-6 border rounded-full border-greenLight"
            src={icon}
            alt={toRealSymbol(symbol)}
          />
        ) : (
          <div className="h-6 w-6 border rounded-full border-greenLight"></div>
        )}
        <div className="pl-5 font-semibold text-sm">{toRealSymbol(symbol)}</div>
      </div>
      <div className="font-semibold text-sm">{amount}</div>
    </div>
  );
}
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

function TokenList(props: {
  tokens: TokenMetadata[];
  balances: TokenBalancesView;
  hideEmpty?: boolean;
}) {
  const { tokens, balances, hideEmpty } = props;
  return(
    <div className="divide-y divide-gray-600">
      {tokens.map((token) => {
        console.log( {tokenId: token.id } )
        const balance = toFixed(balances[token.id] || 0) || '0';
        console.log({ balance });
        if (balance === '0' && hideEmpty) return null;
        const amount = toPrecision(
          toReadableNumber(token.decimals, balance),
          3,
          true
        );
        return <Token
          key={token.id}
          {...token}
          amount={amount}
          totalAmount={toReadableNumber(token.decimals, balance)}
        />
        })}
      {tokens.length === 0 ? (
        <div className="text-center text-gray-600 text-xs font-semibold pt-2 pb-2">
          No tokens deposited
        </div>
      ) : null}
    </div>
  )
}

export default function Assets(props: {
  tokens: TokenMetadata[];
  balances: TokenBalancesView;
}) {
  const { tokens, balances } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card title="Assets">
      <TokenList hideEmpty={true} tokens={tokens} balances={balances} />
      {tokens.length > 0 ? (
        <div className="flex items-center justify-center pt-5">
          <PrimaryButton isFull onClick={() => setIsOpen(true)}>Withdraw</PrimaryButton>
        </div>
      ) : null}
      <WithdrawModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          content: {
            outline: 'none',
          },
        }}
      />
    </Card>
  );
}
