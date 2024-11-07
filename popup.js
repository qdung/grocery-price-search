const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

document.getElementById("searchButton").addEventListener("click", function () {
  const searchTerm = document.getElementById("searchInput").value;
  if (searchTerm) {
    showLoadingSpinner();
    fetchLotte(searchTerm);
    fetchWinmart(searchTerm);
  }
});
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const searchTerm = document.getElementById("searchInput").value;
      if (searchTerm) {
        showLoadingSpinner();
        fetchLotte(searchTerm);
        fetchWinmart(searchTerm);
      }
    }
  });

function showLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}
function hideLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

function fetchLotte(searchTerm) {
  const raw = JSON.stringify({
    limit: 50,
    offset: 1,
    facet_filters: {},
    fields: [
      "id",
      "sku",
      "name",
      "label",
      "price",
      "url_key",
      "image_url",
      "in_stock",
      "promotion",
      "stock_qty",
      "type_id",
      "custom_attribute.bundle_type",
      "ext_overall_rating",
      "ext_overall_review",
      "short_description",
      "bundle_options",
      "child_price",
      "child_stock",
      "configurable_options",
      "configurable_children",
      "custom_attribute",
    ],
    where: {
      query: searchTerm,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://www.lottemart.vn/v1/p/mart/es/vi_nsg/products/search",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      const resultsList = document.getElementById("winmart");
      resultsList.innerHTML = "";
      data["data"]["items"].forEach((result) => {
        const listItem = document.createElement("li");
        listItem.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = result.image_url;
        productImage.alt = result.name;
        productImage.classList.add("product-image");

        const productName = document.createElement("h3");
        productName.textContent = result.name;
        productName.classList.add("product-name");

        const productPrice = document.createElement("p");
        productPrice.textContent = `Giá: ${result.price.VND.default_formated}`;
        listItem.appendChild(productImage);
        listItem.appendChild(productName);
        listItem.appendChild(productPrice);
        resultsList.appendChild(listItem);
      });
      hideLoadingSpinner();
    })
    .catch((error) => {
      hideLoadingSpinner();
      console.error("Error fetching product from lotte results:", error);
    });
}

function fetchWinmart(searchTerm) {
  const raw = JSON.stringify({
    pageSize: 8,
    storeNo: "1535",
    applicationType: "Winmart",
    keyword: searchTerm,
    premiumItemNos: [],
    searchAfter: [],
    storeGroupCode: "1998",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(
    "https://api-crownx.winmart.vn/ss/api/v1/public/winmart/item-search",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      const resultsList = document.getElementById("lotte");
      resultsList.innerHTML = "";
      data.data.itemUoms.forEach((result) => {
        const listItem = document.createElement("li");
        listItem.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = result.image;
        productImage.alt = result.description;
        productImage.classList.add("product-image");

        const productName = document.createElement("h3");
        productName.textContent = result.description;
        productName.classList.add("product-name");

        const productPrice = document.createElement("p");
        productPrice.textContent = `Giá: ${formatVietnameseCurrency(
          result.price.salePrice
        )}`;
        listItem.appendChild(productImage);
        listItem.appendChild(productName);
        listItem.appendChild(productPrice);
        resultsList.appendChild(listItem);
      });
      hideLoadingSpinner();
    })
    .catch((error) => {
      hideLoadingSpinner();
      console.error("Error fetching products Winmart results:", error);
    });
}

function formatVietnameseCurrency(number) {
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
