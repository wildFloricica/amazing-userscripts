// ==UserScript==
// @name        seen-tree-items
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      🌸👍🏽wildFloricica
// @description 11/30/2024, 7:13:07 PM
// ==/UserScript==

var getITEMS = () =>
  document.querySelectorAll(
    "#repos-file-tree li.PRIVATE_TreeView-item[role='treeitem']"
  );

const delClassId = "wildfloricica-removable-hoverable";

function CreateMyUiElem() {
  var div = document.createElement("div");
  // div.setAttribute("title", "")
  div.style.cssText += `
    border-radius: 50%;
    background-color: red;
    width: 20px;
    height: 20px;
  `;
  div.can_append = true;
  div.refreshViewStatus = (isOn) =>
    (div.style.backgroundColor = isOn ? "green" : "red");

  return div;
}

function UseSvgAsToggle(root_item) {
  var visual = root_item.querySelector("svg");
  visual.can_append = false;
  visual.refreshViewStatus = (isOn) =>
    (visual.style.fill = isOn ? "green" : "red");
  return visual;
}

function AddMouseEnterButtonMemory(elem, id_path, root_item) {
  // return if exists
  if (root_item.querySelector("." + delClassId)) return;

  // notify user
  console.log("seen-trees-items: traking new item");

  const key = location.href.split("blob")[0] + id_path;
  var isOn = () => localStorage.getItem(key) || null;

  var visual = UseSvgAsToggle(root_item);
  visual.classList.add(delClassId);
  visual.refreshViewStatus(isOn());

  visual.addEventListener("mouseenter", (e) => {
    // switch value
    localStorage.setItem(key, !isOn() ? "true" : "");
    // refresh
    visual.refreshViewStatus(isOn());
  });

  if (visual.can_append) elem.append(visual);
}

var iid;

function main() {
  // if(getITEMS().length) clearInterval(iid);

  // The Key Generation is now perfect (buggy)
  // Items are loaded only on folder expansion

  getITEMS().forEach((it) => {
    var text = it.querySelector(".PRIVATE_TreeView-item-content");
    AddMouseEnterButtonMemory(text, it.id, it);
  });
}

iid = setInterval(main, 1000);

// push and pop state do not work for url change (maybe some github e.preventDefault())
