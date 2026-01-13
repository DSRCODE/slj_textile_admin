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
      const q = query(collection(db, "cms"), where("slug", "==", pageKey));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        setContent(docData.data().content || "");
        setContentId(docData.id);
      } else {
        // No document exists yet
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

      if (contentId) {
        // Update existing document
        await updateDoc(doc(db, "cms", contentId), payload);
      } else {
        // Create new document with slug as id
        const newDocRef = doc(collection(db, "cms"));
        await setDoc(newDocRef, payload);
        setContentId(newDocRef.id);
      }

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
