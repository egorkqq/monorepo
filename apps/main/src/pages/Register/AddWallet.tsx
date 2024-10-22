import { useNavigate } from "react-router-dom";

import { AddSquareIcon } from "@arc/ui/icons/add-square";
import { ArrowRightIcon } from "@arc/ui/icons/arrow-right";
import { ImportSquareIcon } from "@arc/ui/icons/import-square";
import { KeySquareIcon } from "@arc/ui/icons/key-square";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { RegisterRoute } from "@/routes";

export const RegisterAddWallet = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-title-1 mb-5 mt-4 font-medium">Add wallet</h1>

      <List withGap>
        <ListItem
          className="px-5 py-4"
          leftIcon={<AddSquareIcon className="stroke-accent fill-none" />}
          leftIconClassName="self-start"
          leftTopText={<div className="mt-0.5 text-base">Create wallet</div>}
          leftBottomText={
            <div className="text-caption-1 text-text-secondary text-left">Create a new custom wallet in two clicks</div>
          }
          rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
          onClick={() => navigate(RegisterRoute["secret-key"])}
        />
        <ListItem
          className="px-5 py-4"
          leftIcon={<KeySquareIcon className="stroke-accent fill-none" />}
          leftIconClassName="self-start"
          leftTopText={<div className="mt-0.5 text-base">An existing wallet</div>}
          leftBottomText={
            <div className="text-caption-1 text-text-secondary text-left">
              Add an existing wallet using a 24-word secret key
            </div>
          }
          rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
          onClick={() => navigate(RegisterRoute.existing)}
        />
        {/* TODO: alert with info about new politics */}
        <ListItem
          className="px-5 py-4 opacity-50"
          leftIcon={<ImportSquareIcon className="stroke-accent fill-none" />}
          leftIconClassName="self-start"
          leftTopText={<div className="mt-0.5 text-base">Import wallet</div>}
          leftBottomText={
            <div className="text-caption-1 text-text-secondary text-left">
              Import Wallet, Ton Space, Tonkeeper, MyTonWallet and etc.
            </div>
          }
          rightIcon={<ArrowRightIcon className="stroke-text fill-none opacity-35" />}
        />
      </List>
    </>
  );
};
