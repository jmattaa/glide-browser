import { TabStack } from "./tabStack";

// no need for a whole class can i just do this?
export const tabActivity = {
    removeTime: 600000, // 10 min

    monitor: (tabStack: TabStack) => {
        setInterval(() => {
            tabActivity._update(tabStack)
        }, tabActivity.removeTime / 10);
    },

    _update: (tabStack: TabStack) => {
        tabStack.state.tabs.forEach(tab => {
            if (!tab.id)
                return;
            if (tabStack.state.currentTab.id === tab.id)
                return;

            if (Date.now() - (tab.lastActivity || 0) > tabActivity.removeTime) {
                tabStack.remove(tab.id);
            }
        })
    }
}
