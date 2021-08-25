import { FunctionComponent } from "react";
import { useFormsContext } from "../../../common/context/forms";

interface DocumentCarouselProps {
  validateCurrentForm: () => boolean;
  closePreviewMode: () => void;
}

export const DocumentCarousel: FunctionComponent<DocumentCarouselProps> = () => {
  const { forms, activeFormIndex, setActiveFormIndex } = useFormsContext();

  return (
    <div className="w-full flex overflow-auto py-6 px-4 bg-cerulean-50">
      {forms.map((form, index) => {
        return (
          <div
            onClick={() => setActiveFormIndex(index)}
            className={`cursor-pointer hover:bg-gray-50 bg-white border border-2 p-4 rounded-lg mr-4 whitespace-nowrap${
              index === activeFormIndex ? ` border-cerulean` : ""
            }`}
            key={`${form.fileName}-${index}`}
          >
            {form.fileName}
          </div>
        );
      })}
    </div>
  );
};
