import { FunctionComponent } from "react";
import { Wrapper } from "../../UI/Wrapper";
import { RevokeTag } from "../RevokeTag/RevokeTag";

interface RevokeDocumentTileArea {
  revokeDocuments: any[];
  fileName: string;
}

export const RevokeDocumentTileArea: FunctionComponent<RevokeDocumentTileArea> = ({ revokeDocuments, fileName }) => {
  return (
    <Wrapper isMaxW={true}>
      <RevokeTag doc={revokeDocuments[0]} isPending={false} fileName={fileName} />
    </Wrapper>
  );
};
