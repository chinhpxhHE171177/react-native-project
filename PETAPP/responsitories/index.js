// Fix the import in responsitories.js
import user from "./user";
import { getPopulation } from "./population"; // Corrected import for default export
export { user, getPopulation as population }; // Map to `population` for consistency
