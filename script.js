/* ------------ Side Menu  ------------ */
const menuBtn = document.getElementById("menu-btn");
const modal = document.getElementById("side-menu-modal");
const closeBtn = document.querySelector(".menu-close-btn");
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
  loop: true,
  navigation: {
    nextEl: ".next-btn",
    prevEl: ".prev-btn",
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
      centeredSlides: true,
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

/* ------------ Like btn ------------ */
const likeButtons = document.querySelectorAll(".like-button");

likeButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    btn.classList.toggle("liked");
  });
});

/* ------------ Listing products ------------ */
const numberSelect = document.getElementById("number-select");
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

// create single prdocunt
function createProductElement(item) {
  const product = document.createElement("div");
  product.className = "slide-image-container";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = `ID: ${item.id}`;

  const img = document.createElement("img");
  img.src = item.image;

  // I could not find different sizes of images in API;
  // added because 'srcset' is included in SEO requirements
  img.srcset = `
  ${item.image} 400w,
  ${item.image} 600w,
  ${item.image} 800w
`;

  img.sizes = `
  (max-width: 769px) 420px,
  (max-width: 1279px) 460px,
  570px
`;
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
document.querySelector(".modal-close-btn").addEventListener("click", () => {
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
              <h1>You'll look and feel like the champion.</h1>
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
numberSelect.addEventListener("change", () => {
  pageSize = parseInt(numberSelect.value);
  currentPage = 1;
  productsLoaded = 0;

  // Version with animation
  document
    .querySelectorAll(".grid .slide-image-container")
    .forEach((slide) => slide.classList.add("fade-out"));
  setTimeout(() => {
    grid.innerHTML = `<div class="ad" id="banner">
          <div class="ad-content-container">
            <div class="ad-description">
              <span>Forma’sint.</span>
              <h1>You'll look and feel like the champion.</h1>
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
        </div>`; //reset grid
    loadProducts();
  }, 200);

  // Version without animation
  //  grid.innerHTML = "";
  // loadProducts();
});

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
// Update hash onScroll
window.addEventListener("scroll", updateTitleAndHash);

// Initial
updateTitleAndHash();

// #TODO
// na localhost wszystko działa

// https://kebbsik.github.io/forma_sint_ks/
// z użyciem github pages strona wyświetla sie poprawnie przy pierwszym załadowaniu,
// po odwieżeniu wyskakuje error 404 ; do poprawy - prawdopodbnie chodzi o hash (zmienic na forma_sint_ks/ )
