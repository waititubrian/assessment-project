import time
from telnetlib import EC

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager


class SearchFunctionality:
    def __init__(self):
        options = Options()
        options.add_experimental_option("detach", True)
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        self.driver.maximize_window()

    def close_browser(self):
        if self.driver:
            self.driver.quit()
            print("Browser closed.")

    def landing_page(self, url="http://localhost:3000/"):
        self.driver.get(url)

        get_started_button = self.driver.find_element(By.XPATH, "//*[text()='Get Started']")
        get_started_button.click()

    def login(self):
        actions = ActionChains(self.driver)

        email_field = WebDriverWait(self.driver, 60).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@id='email']")))
        email_field.click()
        actions.send_keys("Karley_Dach@jasper.info").perform()

        password_field = WebDriverWait(self.driver, 60).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@id='password']")))
        password_field.click()
        actions.send_keys("Leopoldo_Corkery").perform()

        login_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Login']")))
        login_button.click()

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Dashboard')]"))
        )

    def navigate_to_albums(self):
        albums_link = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/albums')]"))
        )
        albums_link.click()

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Albums')]"))
        )

    def album_search(self):
        # Define a search term that appears in some JSONPlaceholder album titles
        search_term = "quidem"
        search_field = WebDriverWait(self.driver, 60).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Search albums...']"))
        )
        search_field.click()
        search_field.send_keys(search_term)
        search_field.send_keys(Keys.RETURN)

        print("Albums search results displayed successfully.")

        # Find all album cards after search & verify that results were found
        album_cards = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'card')]")
        assert len(album_cards) > 0, f"No search results found for term '{search_term}'"
        print(f"Found {len(album_cards)} results for search term '{search_term}'")

    def navigate_to_photos(self):
        photos_link = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/photos')]"))
        )
        photos_link.click()

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Photos')]"))
        )
        time.sleep(5)

    def photo_search(self):
        # Define a search term that appears in some JSONPlaceholder photo titles
        search_term = "accusamus"
        search_field = WebDriverWait(self.driver, 60).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Search photos...']"))
        )
        search_field.click()
        search_field.send_keys(search_term)
        search_field.send_keys(Keys.RETURN)

        print("Photos search results displayed successfully.")

        # Find all photo cards after search & verify that results were found
        photo_cards = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'card')]")
        assert len(photo_cards) > 0, f"No search results found for term '{search_term}'"
        print(f"Found {len(photo_cards)} results for search term '{search_term}'")
        time.sleep(5)


if __name__ == "__main__":
    automation = SearchFunctionality()

    try:
        automation.landing_page()
        automation.login()
        automation.navigate_to_albums()
        automation.album_search()
        automation.navigate_to_photos()
        automation.photo_search()
    finally:
        automation.close_browser()