figma.showUI(__html__, { width: 340, height: 560 });

figma.ui.onmessage = (msg) => {
  if (msg.type == "get-collection") {
    const collection = figma.variables.getLocalVariableCollections();
    const result: Object[] = [];

    collection.forEach((item) => {
      console.log("collection", item);
      result.push({
        name: item.name,
        id: item.id,
        modes: item.modes,
        length: item.variableIds.length,
      });
    });

    figma.ui.postMessage({ type: "get-collection", result });
  }

  if (msg.type == "select-collection") {
    const collection = figma.variables.getVariableCollectionById(
      msg.collectionId
    );

    const groupList: String[] = ["all"];

    collection?.variableIds.forEach((variableId) => {
      const variable = figma.variables.getVariableById(variableId);
      console.log("variable", variable);
      if (variable !== null && variable.name.includes("/")) {
        const groupNameRaw = variable.name.split("/");
        const groupNameCompute = groupNameRaw
          .slice(0, groupNameRaw.length - 1)
          .join("/");
        if (groupList.indexOf(groupNameCompute) === -1) {
          groupList.push(groupNameCompute);
        }
      }
    });

    figma.ui.postMessage({ type: "select-collection", groupList });
  }

  if (msg.type == "gen-data") {
    const collection = figma.variables.getVariableCollectionById(
      msg.collectionId
    );
    const variableList: Object[] = [];
    collection?.variableIds.forEach((variableId) => {
      const variable = figma.variables.getVariableById(variableId);
      if (variable !== null) {
        const variableGroupRaw = variable.name.split("/");

        const variableGroupName = variableGroupRaw.slice(
          0,
          variableGroupRaw.length - 1
        ).join('/');
        const variableName = variableGroupRaw[variableGroupRaw.length - 1];
        if (msg.group !== "all") {
          if (variable.name.includes("/") && variableGroupName === msg.group) {
            variableList.push({
              key: variable.name.split("/")[1],
              modes: variable.valuesByMode,
            });
          } else if (variable.name.includes("/")) {
            console.log("include", variable.name, msg.group, variableGroupName);
          } else {
            console.log("not include", variable.name);
          }
        } else {
          variableList.push({
            key: variableName,
            modes: variable.valuesByMode,
          });
        }
      }
    });

    figma.ui.postMessage({ type: "gen-data", variableList });
  }
};
