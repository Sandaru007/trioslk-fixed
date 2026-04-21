import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

def test_admin_financial_report(driver):
    # Assuming frontend is running locally on Vite's default port
    driver.get("http://localhost:5173/admin")
    driver.maximize_window()
    wait = WebDriverWait(driver, 10)
    time.sleep(0.5)

    # 1. Wait for sidebar to load and find 'Financial Reports' tab
    finance_tab = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[span[contains(text(), 'Financial Reports')]]")))
    finance_tab.click()
    time.sleep(0.5)

    # 2. Wait for Financial Report component to load
    report_header = wait.until(EC.visibility_of_element_located((By.XPATH, "//h2[text()='Financial Report']")))
    assert report_header.is_displayed(), "Financial Report header is missing."

    # 3. Verify Stats Cards are visible
    total_income_card = wait.until(EC.visibility_of_element_located((By.XPATH, "//h3[text()='Total Income']")))
    assert total_income_card.is_displayed(), "Total Income card is missing."

    pending_card = driver.find_element(By.XPATH, "//h3[text()='Pending']")
    assert pending_card.is_displayed(), "Pending card is missing."
    time.sleep(0.5)

    # 4. Verify the Payment Records table exists
    table_header = driver.find_element(By.XPATH, "//h3[text()='Payment Records']")
    assert table_header.is_displayed(), "Payment Records table header is missing."

    # Scroll down to see the table
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", table_header)
    time.sleep(0.5)

    # 5. Verify export button is present
    export_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Export CSV')]")
    assert export_btn.is_displayed(), "Export CSV button is missing."

    # 6. Verify Filters are present
    month_filter = driver.find_element(By.NAME, "month")
    assert month_filter.is_displayed(), "Month filter is missing."
    
    status_filter = driver.find_element(By.NAME, "status")
    assert status_filter.is_displayed(), "Status filter is missing."
    
    time.sleep(0.5)
    
    # 7. Verify the new payment record appears in the table
    new_record_name = wait.until(EC.visibility_of_element_located((By.XPATH, "//td[text()='Test User']")))
    new_record_id = driver.find_element(By.XPATH, "//td/span[contains(text(), 'STU1234')]")
    
    assert new_record_name.is_displayed(), "Newly submitted Test User was not found in the admin table!"
    assert new_record_id.is_displayed(), "Newly submitted Student ID STU1234 was not found in the admin table!"
    
    # Scroll to the new record
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", new_record_name)
    time.sleep(0.5)

    # Locate the exact row for this test user
    row = driver.find_element(By.XPATH, "//tr[td[text()='Test User'] and td/span[contains(text(), 'STU1234')]]")
    
    # 8. View Receipt in new tab
    main_window = driver.current_window_handle
    view_receipt_btn = row.find_element(By.XPATH, ".//a[contains(text(), 'View Receipt')]")
    view_receipt_btn.click()
    
    time.sleep(1) # Wait for the new tab to open

    # Switch to the newly opened tab
    for window_handle in driver.window_handles:
        if window_handle != main_window:
            driver.switch_to.window(window_handle)
            break
            
    time.sleep(1) # Let the user see the receipt
    driver.close() # Close the receipt tab
    
    # Switch back to the main dashboard tab
    driver.switch_to.window(main_window)
    time.sleep(0.5)
    
    # 9. Change the status to 'Completed'
    status_select_element = row.find_element(By.XPATH, ".//select")
    status_select = Select(status_select_element)
    status_select.select_by_value("Completed")
    
    time.sleep(0.5)

    # 10. Scroll down and show analyzing part (Smart Income Analysis)
    analysis_header = driver.find_element(By.XPATH, "//h3[text()='Smart Income Analysis']")
    driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", analysis_header)
    
    time.sleep(2) # Final pause to view the chart before closing
