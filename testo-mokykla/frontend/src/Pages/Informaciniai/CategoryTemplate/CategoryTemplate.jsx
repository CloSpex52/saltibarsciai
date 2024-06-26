import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UI from "../../../components/UI/UI";
import styles from "./categoryTemplate.module.css";
import { useAuth } from "../../../context/AuthContext";
import ServerPaths from "../../../context/ServerPaths";
const CategoryTemplate = () => {
  const { user } = useAuth();
  const { categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          ServerPaths.CategoryRoutes.GET_CATEGORY(categoryId),
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        setCategory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Klaida gaudant kategoriją:", error);
      }
    };

    fetchCategory();
  }, [categoryId, user.accessToken]);

  const handleGoBack = () => {
    if (category && category.parentId) {
      navigate(`/category/${category.parentId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <UI>
      {!loading && category ? (
        <div className={`container ${styles.containerColor} p-4 m-4`}>
          <p>Kategorijos pavadinimas: {category.name}</p>
          <p>Šią kategorija sukūrė: {category.User.username}</p>
          {category.bulletPoints &&
            JSON.parse(category.bulletPoints).length > 0 && (
              <>
                <ul className={`nav flex-column ${styles.categoryColor}`}>
                  {JSON.parse(category.bulletPoints).map((point, index) => (
                    <li key={index} className="nav-item px-2">
                      • {point}
                    </li>
                  ))}
                </ul>
              </>
            )}

          <div className={`container text-dark py-2`}>
            <button
              onClick={handleGoBack}
              className={`btn ${styles.backBtn} my-1`}
            >
              Atgal
            </button>
          </div>
        </div>
      ) : (
        <div>Krauna...</div>
      )}
    </UI>
  );
};

export default CategoryTemplate;
