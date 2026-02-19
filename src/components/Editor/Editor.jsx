import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { Button, Tabs, Spin } from "antd";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import PageBreadcrumb from "../PageBreadcrumb/PageBreadcrumb";

const { TabPane } = Tabs;

const CMSMultiEditorFirebase = () => {
  const editor = useRef(null);

  const pages = [
    { key: "privacy-policy", label: "Privacy Policy" },
    { key: "terms-conditions", label: "Terms & Conditions" },
  ];

  const [selectedPage, setSelectedPage] = useState(pages[0].key);
  const [content, setContent] = useState("");
  const [contentId, setContentId] = useState(""); // Firestore doc id
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH CMS ----------------

 const fetchCMS = async (pageKey) => {
   try {
     setLoading(true);

     const docRef = doc(db, "cms", pageKey);
     const snap = await getDoc(docRef);

     if (snap.exists()) {
       setContent(snap.data().content || "");
       setContentId(pageKey);
     } else {
       setContent("");
       setContentId("");
     }
   } catch (err) {
     console.error(err);
     toast.error("Failed to load CMS content");
   } finally {
     setLoading(false);
   }
 };


  useEffect(() => {
    fetchCMS(selectedPage);
  }, [selectedPage]);

  // ---------------- SAVE CMS ----------------
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        slug: selectedPage,
        content,
        updatedAt: new Date(),
      };

      const docRef = doc(db, "cms", selectedPage);

      await setDoc(docRef, payload, { merge: true });

      setContentId(selectedPage);

      toast.success(
        `${pages.find((p) => p.key === selectedPage)?.label} saved successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to save CMS content");
    } finally {
      setLoading(false);
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

      {loading ? (
        <div className="flex justify-center h-[50vh] items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="border rounded mb-2 shadow-md bg-white min-h-[300px]">
          <JoditEditor
            ref={editor}
            value={content}
            config={joditConfig}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          onClick={handleSave}
          size="large"
          disabled={loading}
          style={{ minWidth: "150px" }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default CMSMultiEditorFirebase;
