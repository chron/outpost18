// Returns a unique-ish ID we can use to identify this player even if they
// change names.  Later this will probably be replaced with actual auth, but
// for now we'll just persist this in localstorage.
export default function generatePlayerId() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
}
