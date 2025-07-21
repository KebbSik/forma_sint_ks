if (window.location.hostname === "kebbsik.github.io") {
  const base = document.createElement("base");
  base.href = "/forma_sint_ks/";
  document.head.appendChild(base);
}
/* ------------ Side Menu  ------------ */
const menuBtn = document.getElementById("menu-btn");
const modal = document.getElementById("side-menu-modal");
const closeBtn = document.querySelector(".menu-close-wrapper");
const menuLinks = document.querySelectorAll(".menu-items a");

menuBtn.addEventListener("click", () => {
  modal.classList.add("active");
});
// Close on clicking close btn
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

// Close on clicking outside the menu
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// Close on clicking menu links
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    modal.classList.remove("active");
  });
});

// Close on Esc press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  }
});

/* ------------ Swiper config  ------------ */
const swiper = new Swiper(".mySwiper", {
  lazy: true,
  // lazy: {
  //   loadPrevNext: true,
  // },
  // loop: true,
  navigation: {
    nextEl: ".next-btn",
    prevEl: ".prev-btn",
  },
  on: {
    init: toggleNavButtons,
    slideChange: toggleNavButtons,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "progressbar",
    clickable: true,
  },
  spaceBetween: 24,
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      // centeredSlides: true,
      centeredSlides: false,
    },
    768: {
      slidesPerView: 2,
      centeredSlides: false,
    },
    1024: {
      slidesPerView: 3,
      centeredSlides: false,
    },
    1279: {
      slidesPerView: 4,
      centeredSlides: false,
    },
  },
});

function toggleNavButtons(swiper) {
  const prev = swiper.navigation.prevEl;
  const next = swiper.navigation.nextEl;

  prev.style.display = swiper.isBeginning ? "none" : "";
  next.style.display = swiper.isEnd ? "none" : "";
}

/* ------------ Like btn ------------ */
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    btn.classList.toggle("liked");
  });
});

/* ------------ Custom select  ------------ */
const numberSelect = document.getElementById("number-select");
const customSelect = document.querySelector(".custom-select");
const selected = document.querySelector(".selected");
const selectedValue = document.querySelector(".selected span");
const options = document.querySelector(".options");
const activeValue = document.querySelector(".active-value span");

selected.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

options.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    let placeHolder = selectedValue.textContent;
    selectedValue.textContent = e.target.textContent;
    numberSelect.value = e.target.textContent;
    activeValue.textContent = e.target.textContent;
    activeValue.valueset = e.target.textContent;

    e.target.textContent = placeHolder;
    changeProductNumber();

    customSelect.classList.remove("open");
  }
});

document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});

/* ------------ Listing products ------------ */

const productModal = document.getElementById("product-modal");

let currentPage = 1;
let pageSize = parseInt(numberSelect.value);
let isLoading = false;
let productsLoaded = 0;

document.querySelectorAll(".slide-container").forEach((container) => {
  container.addEventListener("click", () => {
    const image = container.querySelector("img");
    const title = container.querySelector(".inter-text-large");

    //set modal data according to clicked slide
    document.getElementById("modal-image").src = image.src;
    document.getElementById("modal-text").textContent = title
      ? title.textContent
      : "";

    // display modal
    productModal.classList.remove("hidden");
  });
});

// create single product
function createProductElement(item) {
  const product = document.createElement("div");
  product.className = "slide-image-container";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = `ID: ${item.id}`;

  const img = document.createElement("img");
  img.src = item.image;

  // !!! UPDATE !!!
  // Item response:
  //   {
  //     "id": 1,
  //     "text": "test 1",
  //     "image": "https://brandstestowy.smallhost.pl/KURTKA_02.png"
  // }
  //'srcset' is included in SEO requirements but
  // as a single response do not return images in different dimensions, no srcset is needed

  //   img.srcset = `
  //   ${item.image} 400w,
  //   ${item.image} 600w,
  //   ${item.image} 800w
  // `;

  //   img.sizes = `
  //   (max-width: 769px) 420px,
  //   (max-width: 1279px) 460px,
  //   570px
  // `;

  img.loading = "lazy";
  img.alt = item.text;

  product.appendChild(label);
  product.appendChild(img);

  // display modal with current product data;
  // I've added setTimeout just to await change of image
  // without timeout we can still see previous image for a while
  product.addEventListener("click", () => {
    document.getElementById("modal-image").src = item.image;
    document.getElementById("modal-image").alt = item.text;
    document.getElementById("modal-text").textContent = `ID: ${item.id}`;
    setTimeout(() => {
      productModal.classList.remove("hidden");
    }, 150);
  });

  return product;
}

// Close on clicking close btn
document
  .querySelector(".prdouct-close-wrapper")
  .addEventListener("click", () => {
    productModal.classList.add("hidden");
  });

// Close on clicking outside the modal
productModal.addEventListener("click", (e) => {
  if (e.target.id === "product-modal") {
    e.target.classList.add("hidden");
  }
});
// Close on Esc press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!productModal.classList.contains("active")) {
      productModal.classList.add("hidden");
    }
  }
});

/* ------------ Load products from api ------------ */
const grid = document.querySelector(".grid");
const banner = `       
        <div class="ad" id="banner">
          <div class="ad-content-container">
            <div class="ad-description">
              <span>Forma’sint.</span>
              <h2>You'll look and feel like the champion.</h2>
            </div>
            <button class="checkout-btn inter-text">
              <span>Check this out</span>
              <img
                src="assets/ICONS=chevron_right.svg"
                alt="chevron-right"
                loading="lazy"
              />
            </button>
          </div>
        </div>`;

// render banner
grid.innerHTML = banner;

async function loadProducts() {
  if (isLoading) return;
  isLoading = true;

  try {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    const data = await response.json();

    data.data.forEach((item) => {
      const product = createProductElement(item);
      // Version with animation
      product.classList.add("fade-out");
      grid.appendChild(product);
      setTimeout(() => {
        product.classList.remove("fade-out");
      }, 20);
      // Version without animation
      // grid.appendChild(product);
    });

    currentPage++;
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    isLoading = false;
  }
}

// Load product on scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
    !isLoading
  ) {
    loadProducts();
  }
});

// Change number of products
// numberSelect.addEventListener("change", () =>
function changeProductNumber() {
  pageSize = parseInt(numberSelect.value);
  currentPage = 1;
  productsLoaded = 0;

  // Version with animation
  document
    .querySelectorAll(".grid .slide-image-container")
    .forEach((slide) => slide.classList.add("fade-out"));
  setTimeout(() => {
    grid.innerHTML = banner;

    //reset grid
    loadProducts();
  }, 200);

  // Version without animation
  //  grid.innerHTML = "";
  // loadProducts();
}
// );

// Initial producs loading
loadProducts();

/* ------------ Meta ------------ */

// Sections titles
const sectionTitles = {
  home: "Forma Sint - Home",
  featured: "Forma Sint - Featured Products",
  "product-list": "Forma Sint - Product Listing",
};

// Sections Descriptions
const sectionDescriptions = {
  home: "Forma Sint - Strona główna",
  featured: "Polecane produkty",
  "product-list": "Lista produktów",
};

const sections = document.querySelectorAll("section");
let currentHash = "";

// Add meta desc. if not exist
let metaDescription = document.querySelector('meta[name="description"]');
if (!metaDescription) {
  metaDescription = document.createElement("meta");
  metaDescription.name = "description";
  metaDescription.content = "Forma Sint";
  document.head.appendChild(metaDescription);
}

// Title and hash update delayer
// Throttled to prevent excessive updates and cursor appearance issues on scroll.
function throttle(func, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Update title and hash function
function updateTitleAndHash() {
  let found = false;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    // update after reach 50% screen height
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      const id = section.id;

      if (currentHash !== id) {
        // set Tittle
        document.title = sectionTitles[id] || "Forma Sint";

        if (id === "home") {
          history.replaceState(null, null, "");
        } else {
          history.replaceState(null, null, `#${id}`);
        }

        // set Meta description
        metaDescription.content = sectionDescriptions[id] || "Forma Sint";
        // currentHash = id;
      }

      found = true;
    }
  });

  if (!found && currentHash !== "") {
    document.title = "Forma Sint";
    history.replaceState(null, null, " ");
    metaDescription.content = "Forma Sint";
    currentHash = "";
  }
}

// Initial
window.addEventListener("scroll", throttle(updateTitleAndHash, 500));
