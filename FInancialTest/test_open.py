from selenium import webdriver
from selenium.webdriver.chrome.service import Service

if __name__ == "__main__":
    # path to your driver
    service = Service("chromedriver.exe")
    
    driver = webdriver.Chrome(service=service)
    
    driver.get("https://www.google.com")
    
    input("Press Enter to close...")
    driver.quit()