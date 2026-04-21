import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_course_enrollment_and_payment_flow(driver):
    # Assuming frontend is running locally on Vite's default port
    driver.get("http://localhost:5173/courses")
    driver.maximize_window()
    wait = WebDriverWait(driver, 10)
    time.sleep(2) # Slow down to show the initial page

    # 1. Wait for courses to load and 'Enroll Now' button to be clickable
    enroll_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Enroll Now')]")))
    
    # Scroll to the button and click
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", enroll_btn)
    time.sleep(2) # Wait for smooth scroll and user to see the course
    enroll_btn.click()
    time.sleep(2) # Slow down after opening modal

    # 2. Wait for modal to appear and fill step 1 form (Course Enrollment)
    full_name_input = wait.until(EC.visibility_of_element_located((By.NAME, "fullName")))
    full_name_input.send_keys("Test User")
    time.sleep(1)

    driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
    time.sleep(1)

    driver.find_element(By.NAME, "phone").send_keys("0712345678")
    time.sleep(1)

    driver.find_element(By.NAME, "studentId").send_keys("STU1234")
    time.sleep(2) # Pause before proceeding

    # 3. Click proceed to payment
    proceed_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Proceed to Payment')]")
    proceed_btn.click()
    time.sleep(2) # Wait for payment details step to be visible to user

    # 4. Wait for step 2 to load (Payment Details)
    bank_transfer_radio = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@value='Bank Transfer']")))
    
    # Click the label to select the radio (as the input is styled/hidden)
    bank_transfer_label = driver.find_element(By.XPATH, "//label[contains(@class, 'payment-method-card')]")
    bank_transfer_label.click()
    time.sleep(2) # Pause after selecting Bank Transfer

    # 5. Upload the dummy receipt file
    receipt_input = wait.until(EC.visibility_of_element_located((By.NAME, "receipt")))
    import os
    pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Design.pdf")
    receipt_input.send_keys(pdf_path)
    time.sleep(2) # Show the uploaded file to the user

    # 6. Click Pay Now and handle the alert
    pay_now_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Pay Now')]")
    assert pay_now_btn.is_enabled(), "Pay Now button should be enabled after selecting Bank Transfer."
    pay_now_btn.click()
    
    # Wait for the success alert to appear and accept it
    alert = wait.until(EC.alert_is_present())
    time.sleep(2) # Read the alert
    alert.accept()
    time.sleep(2) # Final pause to see the modal close
