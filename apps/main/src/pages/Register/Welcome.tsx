import { useNavigate } from "react-router-dom";

import { CoinIcon } from "@arc/ui/icons/coin";
import { GameboyIcon } from "@arc/ui/icons/gameboy";
import { ShieldTickIcon } from "@arc/ui/icons/shield-tick";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { ShowMainButton } from "@/components/MainButton";
import { RegisterRoute } from "@/routes";

export const RegisterWelcome = () => {
  const navigate = useNavigate();

  return (
    <ShowMainButton onClick={() => navigate(RegisterRoute["add-wallet"])} title="Next">
      <h1 className="text-title-1 mb-5 mt-4 font-medium">
        Welcome to <span className="text-accent">Architec.TON</span>
      </h1>

      <List withGap>
        <ListItem
          className="px-5 py-4"
          leftIconClassName="self-start"
          leftIcon={<CoinIcon className="stroke-accent h-6 w-6 self-start" />}
          leftTopText={<div className="mt-0.5">Low transaction fees</div>}
          leftBottomText="Our wallet has some of the lowest transaction levels on the TON blockchain network in the world. We are working to make sure that you pay even less."
        />
        <ListItem
          className="px-5 py-4"
          leftIconClassName="self-start"
          leftIcon={<GameboyIcon className="stroke-accent h-6 w-6" />}
          leftTopText={<div className="mt-0.5">Combining game projects</div>}
          leftBottomText="Massive support for tokens of a large number of game projects created on the basis of the TON blockchain. Tokenization of everyday products."
        />
        <ListItem
          className="px-5 py-4"
          leftIconClassName="self-start"
          leftIcon={<ShieldTickIcon className="stroke-accent h-6 w-6" />}
          leftTopText={<div className="mt-0.5">Data security level</div>}
          leftBottomText="High level of personal data security. Full responsibility for the decentralization of all information."
        />
      </List>
    </ShowMainButton>
  );
};
