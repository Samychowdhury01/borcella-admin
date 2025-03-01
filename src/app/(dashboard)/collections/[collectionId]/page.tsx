import React from "react";
import CollectionForm from "../new/_components/collection-form";
import { Separator } from "@/components/ui/separator";
import { getSingleCollection } from "@/actions/collection-action";
import { redirect } from "next/navigation";
const EditCollectionPage = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;
  const collectionDetails = await getSingleCollection(collectionId);
  const isCollectionExist = collectionDetails !== null;
  if (!isCollectionExist) {
    return redirect("/collections");
  }
  return (
    <section className="p-10">
      <div>
        <p className="text-heading2-bold text-gray-1">Edit Collection</p>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      <CollectionForm initialData={collectionDetails!} HTTPType="PUT"/>
    </section>
  );
};

export default EditCollectionPage;
