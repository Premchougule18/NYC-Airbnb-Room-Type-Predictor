# 🏠 NYC Airbnb Room Type Predictor

A Machine Learning web application that predicts the **Airbnb room type** based on listing information such as location, price, minimum nights, reviews, availability, and neighbourhood details.

The project uses a trained Machine Learning pipeline with a **FastAPI backend** and a simple **HTML, CSS, and JavaScript frontend**. The application is deployed on Render and provides predictions through a REST API.

---

## 📌 Project Description

The **NYC Airbnb Room Type Predictor** is a supervised Machine Learning classification project built using the New York City Airbnb Open Data dataset.

The application takes important Airbnb listing features as input and predicts the corresponding room type.

The model can help understand how factors such as:

* Location
* Price
* Minimum nights
* Number of reviews
* Reviews per month
* Host listing count
* Availability
* Neighbourhood

are related to the type of Airbnb accommodation.

The trained model is saved as a reusable pipeline and integrated with a FastAPI backend for real-time predictions.

---

## ✨ Features

* 🏠 Predicts Airbnb room type
* 🤖 Machine Learning classification model
* 🔗 FastAPI REST API
* 📊 Prediction probability output
* ✅ Input validation using Pydantic
* 🌐 Simple responsive frontend
* 🚀 Deployed on Render
* 📦 Pre-trained model pipeline
* 🔄 Real-time prediction

---

## 🧠 Machine Learning Workflow

The project follows a complete Machine Learning workflow:

```text
Dataset
   ↓
Data Cleaning
   ↓
Exploratory Data Analysis
   ↓
Feature Selection
   ↓
Categorical Feature Encoding
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Pipeline Creation
   ↓
Model Serialization
   ↓
FastAPI Integration
   ↓
Web Application
   ↓
Render Deployment
```

---

## 📊 Input Features

The prediction API uses the following features:

| Feature                          | Description                                |
| -------------------------------- | ------------------------------------------ |
| `latitude`                       | Latitude coordinate of the Airbnb listing  |
| `longitude`                      | Longitude coordinate of the Airbnb listing |
| `price`                          | Price per night                            |
| `minimum_nights`                 | Minimum number of nights required          |
| `number_of_reviews`              | Total number of reviews                    |
| `reviews_per_month`              | Average reviews received per month         |
| `calculated_host_listings_count` | Number of listings owned by the host       |
| `availability_365`               | Number of days available in a year         |
| `neighbourhood_group`            | NYC borough / neighbourhood group          |
| `neighbourhood`                  | Specific neighbourhood                     |

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Frontend

* HTML
* CSS
* JavaScript

### Deployment

* Render

### Development

* Jupyter Notebook
* VS Code
* Git
* GitHub

---

## 📁 Project Structure

```text
NYC-Airbnb-Room-Type-Predictor/
│
├── main.py
├── Model_Pipeline.pkl
├── nyc_airbnb_room_type_classification.ipynb
├── index.html
├── style.css
├── script.js
├── requirements.txt
├── .python-version
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Premchougule18/NYC-Airbnb-Room-Type-Predictor.git
```

### 2. Navigate to the Project

```bash
cd NYC-Airbnb-Room-Type-Predictor
```

### 3. Create Virtual Environment

```bash
python -m venv myenv
```

### 4. Activate Virtual Environment

#### Windows

```powershell
myenv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run the Application Locally

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

The application will run at:

```text
http://127.0.0.1:8000
```

### 📚 API Documentation

FastAPI automatically provides interactive API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

---

## 🔮 API Endpoint

### Prediction Endpoint

```text
POST /predict
```

Example request:

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "price": 150,
  "minimum_nights": 2,
  "number_of_reviews": 50,
  "reviews_per_month": 2.5,
  "calculated_host_listings_count": 3,
  "availability_365": 200,
  "neighbourhood_group": "Manhattan",
  "neighbourhood": "Chelsea"
}
```

Example response:

```json
{
  "Predicted_room_type": "Private room",
  "Probability": [
    0.12,
    0.78,
    0.10
  ]
}
```

---

## 🔍 How It Works

1. User enters Airbnb listing information.
2. Frontend sends the data to the FastAPI `/predict` endpoint.
3. Pydantic validates the input values.
4. The trained Machine Learning pipeline processes the input.
5. The model predicts the Airbnb room type.
6. Prediction probabilities are generated.
7. The result is returned to the frontend.

---

## 🌐 Deployment

The application is deployed using **Render**.

### Live Application

👉 **https://nyc-airbnb-room-type-predictor-2-07o8.onrender.com**

### Render Configuration

**Build Command:**

```bash
pip install -r requirements.txt
```

**Start Command:**

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The project uses Python 3.13 for deployment compatibility.

---

## 📦 Requirements

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
pydantic==2.10.4
pandas==2.2.3
scikit-learn==1.6.1
joblib==1.4.2
```

---

## 📚 Dataset

This project is based on the **New York City Airbnb Open Data** dataset.

The dataset contains Airbnb listing information including:

* Location
* Price
* Reviews
* Availability
* Host information
* Neighbourhood
* Room type

---

## 🎯 Learning Outcomes

Through this project, I practiced:

* Data preprocessing
* Exploratory Data Analysis
* Feature engineering
* Categorical encoding
* Machine Learning classification
* Model evaluation
* Pipeline creation
* Model serialization using Joblib
* FastAPI API development
* Pydantic data validation
* Frontend-backend integration
* REST API development
* Cloud deployment using Render

---

## 🚧 Future Improvements

* Add model performance metrics to the web application
* Improve frontend UI/UX
* Add more advanced models
* Add prediction history
* Add visual analytics dashboard
* Add Docker support
* Add automated CI/CD deployment
* Improve model interpretability using SHAP

---

## 👨‍💻 Author

**Prem Chougule**

### GitHub

👉 **[Premchougule18](https://github.com/Premchougule18)**

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

**Thank you for visiting the project! 🚀**

