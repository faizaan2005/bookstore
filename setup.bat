@echo off
echo =============================================
echo   BookVerse - Virtual Bookstore Setup
echo =============================================

echo.
echo [1/3] Installing frontend dependencies...
cd frontend
call npm install
echo Frontend dependencies installed!

echo.
echo [2/3] Frontend setup complete!
echo.
echo [3/3] Backend: Make sure MySQL is running and update application.properties

echo.
echo =============================================
echo   SETUP COMPLETE - How to Run:
echo =============================================
echo.
echo Backend:
echo   cd backend
echo   mvn spring-boot:run
echo.
echo Frontend (in a new terminal):
echo   cd frontend
echo   npm start
echo.
echo Demo Credentials:
echo   Admin: admin@bookstore.com / admin123
echo   User:  john@example.com / user123
echo.
pause
