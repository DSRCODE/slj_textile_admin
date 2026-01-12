import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { Button, Tabs } from "antd";
import { useEditCmsMutation, useGetCmsQuery } from "../../redux/api/cmsApi";
import { toast } from "react-toastify";
import PageBreadcrumb from "../PageBreadcrumb/PageBreadcrumb";

const { TabPane } = Tabs;

const CMSMultiEditor = () => {
  const editor = useRef(null);

  const pages = [
    { key: "privacy-policy", label: "Privacy Policy" },
    { key: "terms-conditions", label: "Terms & Conditions" },
  ];

  const [selectedPage, setSelectedPage] = useState(pages[0].key);
  const [content, setContent] = useState("");
  const [contentId, setContentId] = useState("");
  const [serverContent, setServerContent] = useState("");
  const [title, setTitle] = useState("");

  const {
    data: cmsData,
    isFetching,
    refetch,
  } = useGetCmsQuery({ slug: selectedPage });

  const [editCms, { isLoading: isSaving }] = useEditCmsMutation();

  // ✅ Load CMS content correctly
  useEffect(() => {
    const cmsItem = cmsData?.response;

    if (cmsItem) {
      setContent(cmsItem.content || "");
      setServerContent(cmsItem.content || "");
      setContentId(cmsItem._id);
      setTitle(cmsItem.title || "");
    } else {
      setContent("");
      setServerContent("");
      setContentId("");
      setTitle("");
    }
  }, [cmsData, selectedPage]);

  // ✅ Save handler (PUT payload fixed)
  const handleSave = async () => {
    try {
      const payload = {
        title,
        content,
        privacy: "public",
      };

      await editCms({
        id: contentId,
        formdata: payload,
      }).unwrap();

      toast.success(
        `${
          pages.find((p) => p.key === selectedPage)?.label
        } updated successfully`
      );

      refetch();
    } catch (error) {
      toast.error("Failed to save content");
      setContent(serverContent);
    }
  };

  const joditConfig = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    uploader: { insertImageAsBase64URI: true },
    removeButtons: ["about"],
    placeholder: "Start editing content here...",
  };

  return (
    <div className="p-4">
      <PageBreadcrumb title="CMS Management" />

      <Tabs
        activeKey={selectedPage}
        onChange={setSelectedPage}
        type="card"
        className="mb-4"
      >
        {pages.map((page) => (
          <TabPane tab={page.label} key={page.key} />
        ))}
      </Tabs>

      <div className="border rounded mb-2 shadow-md bg-white min-h-[300px]">
        <JoditEditor
          ref={editor}
          value={content}
          config={joditConfig}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          onClick={handleSave}
          size="large"
          disabled={isFetching || isSaving}
          style={{ minWidth: "150px" }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CMSMultiEditor;
