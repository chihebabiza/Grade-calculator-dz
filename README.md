# 📚 Dynamic Grade Calculator

This is a web application built with **Next.js** that allows university students to dynamically calculate their overall **moyenne (average)** based on individual module performance.

## 🚀 Features

- Add modules with:
  - Name
  - Coefficient
  - Grades: Exam, TD, TP
- Choose from different grading schemes:
  - Exam only
  - Exam + TD
  - Exam + TP
  - Exam + TD + TP
- Edit weight distribution between exam and TD/TP (must sum to 1)
- Automatically calculate:
  - Module average
  - Overall moyenne using coefficients
- Data is saved in the browser using `localStorage`
- Clear all saved modules with one click

## 🧠 How It Works

- The app calculates each module average based on the selected grading scheme.
- It then calculates the overall moyenne using:
  
```

Σ(module average × coefficient) / Σ(coefficients)

```

## 💻 Technologies Used

- Next.js
- TypeScript
- localStorage for data persistence

## 🔗 Live Demo

👉 [Click to try it out](https://v0-dynamic-grade-calculator.vercel.app/)

## 📄 License

This project is licensed under the **MIT License**.
