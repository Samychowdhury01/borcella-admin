import CollectionForm from "./_components/collection-form";
import { Separator } from "@/components/ui/separator";
const CreateCollectionPage = () => {
  return (
    <section className="p-10">
      <div>
        <p className="text-heading2-bold text-gray-1">Create Collection</p>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      <CollectionForm HTTPType="POST"/>
    </section>
  );
};

export default CreateCollectionPage;
