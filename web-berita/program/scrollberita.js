// document.addEventListener("DOMContentLoaded", function () {
//   let current = 1;

//   const segmen1 = document.getElementById("segmen_1");
//   const segmen2 = document.getElementById("segmen_2");
//   const indicator = document.getElementById("sect3_indicator");
//   const btnNext = document.getElementById("next_sect3");
//   const btnPrev = document.getElementById("prev_sect3");

//   function slide(direction) {
//     const outClass =
//       direction === "next" ? "slide-out-left" : "slide-out-right";
//     const inClass = direction === "next" ? "slide-in-right" : "slide-in-left";

//     const current_seg = current === 1 ? segmen1 : segmen2;
//     const next_seg = current === 1 ? segmen2 : segmen1;

//     current_seg.classList.add(outClass);

//     setTimeout(() => {
//       current_seg.classList.add("hidden");
//       current_seg.classList.remove(outClass);

//       next_seg.classList.remove("hidden");
//       next_seg.classList.add(inClass);

//       setTimeout(() => {
//         next_seg.classList.add("active");
//         next_seg.classList.remove(inClass);

//         setTimeout(() => {
//           next_seg.classList.remove("active");
//         }, 400);
//       }, 20);
//     }, 400);
//   }

//   btnNext.addEventListener("click", function () {
//     if (current < 2) {
//       slide("next");
//       current = 2;
//       indicator.textContent = "2 / 2";
//     }
//   });

//   btnPrev.addEventListener("click", function () {
//     if (current > 1) {
//       slide("prev");
//       current = 1;
//       indicator.textContent = "1 / 2";
//     }
//   });
// });
