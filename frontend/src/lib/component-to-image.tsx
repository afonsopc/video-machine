import domtoimage, { Options } from "dom-to-image";
import { createRoot } from "react-dom/client";

export const componentToImage = async (
  imageOptions: Options,
  {
    component: Component,
    props,
  }: {
    component: React.ElementType;
    props?: Record<string, any>;
  },
): Promise<Blob> => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "0px";
  container.style.top = "0px";
  container.style.width = (imageOptions.width ?? "0") + "px";
  container.style.height = (imageOptions.height ?? "0") + "px";
  container.style.zIndex = "-9999";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<Component {...props} />);

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return domtoimage.toBlob(container, imageOptions).finally(() => {
    root.unmount();
    document.body.removeChild(container);
  });
};
