"use strict";

const fetch = require("node-fetch");
const { ITEMS } = require("./constants");

async function fetchSingleItem(item) {
  return fetch(process.env.URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: 0,
      size: 16,
      filter: {
        itemKind: item.itemKind,
        enchantmentLevel: 0,
        blockchain: "TRON",
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const single = data.auctionsPage.content[0];
      console.log(single);
      return `<b><a href="${item.link}">${item.name}</a></b>\nPrice: <code>${single.pricePerUnit}</code> Qty: <code>${single.quantity}</code>`;
    });
}

async function fetchPrice() {
  let text = "";
  return Promise.all(ITEMS.map((item) => fetchSingleItem(item))).then(
    (data) => {
      text = data.join("\n\n");
      return text;
    }
  );
}

async function broadcast(chat_id, text) {
  return fetch(process.env.BOT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode: "html",
      disable_web_page_preview: true,
    }),
  })
    .then(async (response) =>
      console.log("Telegram sendMessage Response", await response.json())
    )
    .catch((error) => console.error("Telegram sendMessage Error", error));
}

module.exports.shopkeeper = async (event) => {
  const text = await fetchPrice();
  await broadcast(process.env.CH, text);
  return {
    statusCode: 200,
  };
};
