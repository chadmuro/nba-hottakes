export default function DeleteHotTakeModal({
  onDeleteClick,
  closeDeleteModal,
}: {
  onDeleteClick: () => Promise<void>;
  closeDeleteModal: () => void;
}) {
  return (
    <>
      <input
        type="checkbox"
        id="delete-hottake-modal"
        className="modal-toggle"
      />
      <label
        htmlFor="delete-hottake-modal"
        className="modal cursor-pointer"
        onClick={closeDeleteModal}
      >
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">
            Are you sure you want to delete this hot take?
          </h3>
          <p className="py-4">Once deleted it cannot be recovered.</p>
          <label
            htmlFor="delete-hottake-modal"
            className="btn btn-outline mr-2"
            onClick={closeDeleteModal}
          >
            Cancel
          </label>
          <label
            htmlFor="delete-hottake-modal"
            onClick={onDeleteClick}
            className="btn btn-error"
          >
            Delete
          </label>
        </label>
      </label>
    </>
  );
}
