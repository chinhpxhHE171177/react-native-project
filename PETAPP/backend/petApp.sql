CREATE DATABASE petcare;
use petcare;

CREATE DATABASE petcare;
USE petcare;

-- Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15),
    Address VARCHAR(255),
    Role ENUM('Admin', 'Customer', 'Doctor') DEFAULT 'Customer',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Url VARCHAR(500)
);

-- Doctors Table
CREATE TABLE Doctors (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,  
    Specialty VARCHAR(100),
    Experience INT,  
    Rating DECIMAL(3, 2) DEFAULT 0.00,  
    ReviewCount INT DEFAULT 0,  
    AvailableFor VARCHAR(255),  
    Address VARCHAR(255),  
    Avatar VARCHAR(255),  
    About VARCHAR(500)
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    DoctorID INT NOT NULL,  
    CustomerID INT NOT NULL,  
    ReviewText TEXT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),  
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Categories Table (New)
CREATE TABLE PetCareCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    Description TEXT
);

-- Bảng Loại Thú Cưng (Categories Pets)
CREATE TABLE PetCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng Thú Cưng (Pets)
CREATE TABLE Pets (
    PetID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CategoryID INT NOT NULL,  -- Liên kết với PetCategories
    PetName VARCHAR(100) NOT NULL,
    PetBreed VARCHAR(150),
    PetAge INT CHECK (PetAge >= 0), -- Đảm bảo tuổi không âm
    PetGender ENUM('Male', 'Female', 'Unknown') NOT NULL DEFAULT 'Unknown',
    PetWeight DECIMAL(6,2) CHECK (PetWeight >= 0), -- Đảm bảo cân nặng không âm
    PetDescription TEXT,
    PetImage VARCHAR(500),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES PetCategories(CategoryID) ON DELETE CASCADE
);

-- PetCareServices Table (Updated to include Category)
CREATE TABLE PetCareServices (
    ServiceID INT AUTO_INCREMENT PRIMARY KEY,
    DoctorID INT NOT NULL,  
    CategoryID INT NOT NULL,  
    ServiceName VARCHAR(100),
    Description TEXT,
    -- Cost DECIMAL(10, 2),  
    Cost INT,  
    Url VARCHAR(500),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE,
    FOREIGN KEY (CategoryID) REFERENCES PetCareCategories(CategoryID) ON DELETE CASCADE
);

-- Reviews PetCare Services Table
CREATE TABLE ServiceReviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    ServiceID INT NOT NULL,  
    UserID INT NOT NULL,  
    ReviewText TEXT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),  
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ServiceID) REFERENCES PetCareServices(ServiceID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Chats Table
CREATE TABLE Chats (
    ChatID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    DoctorID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE
);

-- Messages Table (Fixed syntax errors)
CREATE TABLE Messages (
    MessageID INT AUTO_INCREMENT PRIMARY KEY,
    ChatID INT NOT NULL,
    SenderID INT NOT NULL,
    MessageText TEXT NOT NULL,
    SentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    IsDeleted BOOLEAN DEFAULT FALSE,
    DeleteAt TIMESTAMP NULL,
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID) ON DELETE CASCADE,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);


-- Schedule Table (Appointments)
CREATE TABLE Schedules (
    ScheduleID INT AUTO_INCREMENT PRIMARY KEY,
    DoctorID INT NOT NULL,
    CustomerID INT NOT NULL,
    PetID INT NOT NULL,  
    ServiceID INT NOT NULL,  
    AppointmentStart DATETIME NOT NULL,  -- Thời gian bắt đầu cuộc hẹn
    AppointmentEnd DATETIME NOT NULL,  
    Status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pets(PetID) ON DELETE CASCADE,
    FOREIGN KEY (ServiceID) REFERENCES PetCareServices(ServiceID) ON DELETE CASCADE
);


-- Bảng DoctorSlots để quản lý lịch hẹn của bác sĩ
CREATE TABLE DoctorSlots (
    SlotID INT AUTO_INCREMENT PRIMARY KEY,
    DoctorID INT NOT NULL,  
    SlotStart DATETIME NOT NULL,  
    SlotEnd DATETIME NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE, -- Nếu lịch này còn trống hay đã được đặt
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE
);


CREATE TABLE Favorites (
    FavoriteID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    DoctorID INT NULL,
    PetID INT NULL,
    ServiceID INT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE CASCADE,
    FOREIGN KEY (PetID) REFERENCES Pets(PetID) ON DELETE CASCADE,
    FOREIGN KEY (ServiceID) REFERENCES PetCareServices(ServiceID) ON DELETE CASCADE
);

-- Inserting 3 users
INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, Address, Role) VALUES
('Alice Johnson', 'alice@example.com', 'hashedpassword1', '1234567890', '123 Elm St, Springfield', 'Customer'),
('Bob Smith', 'bob@example.com', 'hashedpassword2', '0987654321', '456 Oak St, Springfield', 'Customer'),
('Dr. Emily Carter', 'emily@example.com', 'hashedpassword3', '1112223333', '789 Pine St, Springfield', 'Doctor');

-- Inserting 3 doctors (including Dr. Emily Carter)
INSERT INTO Doctors (UserID, Specialty, Experience, Rating, ReviewCount, AvailableFor, Address, Avatar) VALUES
(3, 'Veterinary Medicine', 10, 4.8, 3, 'Dog, Cat', '789 Pine St, Springfield', 'avatar_emily.jpg'),
(4, 'Animal Surgery', 8, 4.9, 4, 'Dog, Cat, Reptiles', '101 Maple St, Springfield', 'avatar_bob.jpg'),
(5, 'Pet Nutrition', 5, 4.7, 5, 'Dog', '202 Cedar St, Springfield', 'avatar_alice.jpg');

-- Inserting reviews for the doctors
INSERT INTO Reviews (DoctorID, CustomerID, ReviewText, Rating) VALUES
(1, 1, 'Dr. Emily is amazing, my pets love her!', 5), -- Review for Dr. Emily
(1, 2, 'Great doctor! Very caring and professional.', 4),
(1, 1, 'Love the services provided. Highly recommend.', 5),

(2, 1, 'Bob did a great job with the surgery on my cat.', 5), -- Review for Dr. Bob
(2, 2, 'Professional and knowledgeable.', 4),
(2, 1, 'I felt very confident leaving my pet with him.', 5),
(2, 1, 'Highly recommend!', 5),

(3, 1, 'Alice provided excellent nutrition advice for my dog!', 5), -- Review for Dr. Alice
(3, 2, 'Very helpful and knowledgeable in pet diets.', 5),
(3, 1, 'My dog is healthier than ever, thanks to her advice!', 5);



 {/* Thêm các review khác ở đây */ }


INSERT INTO Chats (UserID, DoctorID)
VALUES (8, 6);


-- Tin nhắn từ người dùng đến bác sĩ
INSERT INTO Messages (ChatID, SenderID, ReceiverID, MessageText)
VALUES (1, 1, 2, 'Chào bác sĩ, tôi muốn hỏi về tình trạng sức khỏe của thú cưng.');

-- Tin nhắn từ bác sĩ đến người dùng
INSERT INTO Messages (ChatID, SenderID, ReceiverID, MessageText)
VALUES (1, 2, 1, 'Chào bạn, vui lòng cung cấp thêm thông tin về tình trạng của thú cưng nhé.');

-- Tin nhắn tiếp theo từ người dùng
INSERT INTO Messages (ChatID, SenderID, ReceiverID, MessageText)
VALUES (1, 1, 2, 'Thú cưng của tôi bị sốt và không ăn uống gì từ sáng.');

-- Tin nhắn từ bác sĩ phản hồi
INSERT INTO Messages (ChatID, SenderID, ReceiverID, MessageText)
VALUES (1, 2, 1, 'Bạn hãy đưa thú cưng đến phòng khám để tôi kiểm tra kỹ hơn nhé.');



-- Insert data into PetCareCategories table
INSERT INTO PetCareCategories (CategoryName, Description) VALUES
('Veterinary Services', 'Medical check-ups, diagnosis, treatment, and healthcare for pets'),
('Grooming Services', 'Bathing, fur trimming, and hygiene services for pets'),
('Pet Boarding & Daycare', 'Providing pet boarding services for hours, days, or long-term when owners are away'),
('Pet Training', 'Training pets with basic and advanced skills'),
('Dog Walking Services', 'Dog walking services to help pets stay active');

-- Insert data into PetCareServices table
INSERT INTO PetCareServices (DoctorID, CategoryID, ServiceName, Description, Cost) VALUES
-- Veterinary Services
(1, 1, 'Medical Check-up', 'General health check-ups, diagnosis, and treatment for pets', 200000),
(1, 1, 'Vaccination', 'Routine vaccination shots for disease prevention', 150000),
(1, 1, 'Surgery', 'Performing necessary surgical procedures for pets', 300000),
(2, 1, 'Dental Care', 'Teeth cleaning, examination, and treatment of oral diseases', 100000),

-- Grooming Services
(3, 2, 'Bathing', 'Thorough bathing, fur brushing, and skin care for pets', 120000),
(3, 2, 'Fur Trimming', 'Hair cutting and styling according to owner’s request', 180000),
(4, 2, 'Nail Care', 'Nail trimming, filing, and hygiene care for pets', 80000),

-- Pet Boarding & Daycare
(5, 3, 'Daycare Service', 'Short-term pet boarding for the day, ensuring safety and care', 250000),
(5, 3, 'Long-term Boarding', 'Extended pet boarding for owners who are away', 500000),

-- Pet Training
(6, 4, 'Basic Training', 'Teaching pets basic commands like sit, stay, and stand', 300000),
(6, 4, 'Socialization Training', 'Helping pets become more comfortable with humans and other animals', 350000),

-- Dog Walking Services
(7, 5, 'Individual Dog Walking', 'One-on-one dog walking sessions by the hour or on a fixed schedule', 100000),
(7, 5, 'Group Dog Walking', 'Walking in groups to help pets socialize with others', 150000);
