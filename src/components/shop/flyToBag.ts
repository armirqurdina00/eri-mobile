/**
 * Sends a copy of the product photo from the button the shopper pressed to the
 * visible bag icon, so it's obvious where the item went.
 */
export function flyToBag(from: HTMLElement | null, image: string) {
  if (!from || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = [...document.querySelectorAll<HTMLElement>("[data-bag-target]")].find(
    (el) => el.offsetParent !== null
  );
  if (!target) return;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = 72;
  const ghost = document.createElement("div");
  ghost.style.cssText = `position:fixed;z-index:100;left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px;border-radius:18px;pointer-events:none;background:linear-gradient(180deg,#2a2e37,#1b1e25);border:1px solid rgb(255 255 255/.1);box-shadow:0 12px 40px rgb(0 0 0/.6);overflow:hidden`;
  const img = document.createElement("img");
  img.src = image;
  img.style.cssText = "width:100%;height:100%;object-fit:contain;padding:8px";
  ghost.appendChild(img);
  document.body.appendChild(ghost);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  ghost
    .animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx * 0.5}px,${dy - 80}px) scale(0.8)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px,${dy}px) scale(0.2)`, opacity: 0.2 },
      ],
      { duration: 750, easing: "cubic-bezier(0.5, 0, 0.3, 1)" }
    )
    .finished.then(() => {
      ghost.remove();
      target.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], {
        duration: 350,
        easing: "ease-out",
      });
    });
}
