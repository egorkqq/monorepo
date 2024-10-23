import React from "react";

import { useNetwork } from "@arc/sdk";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";
import { TabGroup } from "@arc/ui/tab-group";

const networks = ["mainnet", "testnet"] as const;

const networksMap = networks.map((network) => ({ label: network.toUpperCase(), value: network }));

type Network = (typeof networks)[number];

export const Settings: React.FC = () => {
  const { network, switchNetwork } = useNetwork();

  return (
    <div>
      <h1 className="text-title-1 mb-3 mt-4 font-medium">Settings</h1>

      <List withGap>
        <ListItem
          leftTopText="App Network"
          rightTopText={
            <div className="flex items-center gap-2">
              <TabGroup<Network> items={networksMap} value={network} onSelect={switchNetwork} />
            </div>
          }
        />
      </List>
    </div>
  );
};
