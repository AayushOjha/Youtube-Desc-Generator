import { Fragment } from "react";

interface props {
  description: string;
}

function DescriptionComponent({ description }: props) {
  // Split the description string by newline characters
  const descriptionLines = description.split("\n");

  return (
    <div className="mt-10 border rounded-2xl p-3.5">
      {/* Map through each line and render it with a <br /> element */}
      {descriptionLines.map((line, index) => (
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

export { DescriptionComponent };
