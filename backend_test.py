import requests
import sys
import json
import time
from datetime import datetime
import uuid

class HealthChatbotAPITester:
    def __init__(self, base_url="https://medbot-prototype.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = str(uuid.uuid4())

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:500]}")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_supported_languages(self):
        """Test supported languages endpoint"""
        success, response = self.run_test(
            "Supported Languages",
            "GET",
            "api/supported-languages",
            200
        )
        
        if success and isinstance(response, dict) and 'languages' in response:
            languages = response['languages']
            print(f"   Found {len(languages)} supported languages")
            for lang in languages[:3]:  # Show first 3
                print(f"   - {lang.get('name', 'Unknown')} ({lang.get('native_name', 'Unknown')})")
        
        return success

    def test_chat_functionality(self):
        """Test chat endpoint with different languages"""
        test_cases = [
            ("english", "What are the symptoms of dengue fever?"),
            ("hindi", "डेंगू बुखार के लक्षण क्या हैं?"),
            ("tamil", "டெங்கு காய்ச்சலின் அறிகுறிகள் என்ன?")
        ]
        
        all_passed = True
        for language, message in test_cases:
            success, response = self.run_test(
                f"Chat in {language}",
                "POST",
                "api/chat",
                200,
                data={
                    "message": message,
                    "language": language,
                    "session_id": self.session_id
                }
            )
            
            if success and isinstance(response, dict):
                if 'response' in response:
                    print(f"   AI Response length: {len(response['response'])} characters")
                    print(f"   Response preview: {response['response'][:100]}...")
                else:
                    print(f"   Warning: No 'response' field in response")
                    all_passed = False
            else:
                all_passed = False
                
            # Add delay between requests to avoid rate limiting
            time.sleep(1)
        
        return all_passed

    def test_vaccination_reminders(self):
        """Test vaccination reminders endpoint"""
        test_cases = [
            ("child", "english"),
            ("adult", "hindi")
        ]
        
        all_passed = True
        for age_group, language in test_cases:
            success, response = self.run_test(
                f"Vaccination Reminders - {age_group} in {language}",
                "GET",
                f"api/vaccination-reminders?age_group={age_group}&language={language}",
                200
            )
            
            if success and isinstance(response, dict) and 'vaccination_info' in response:
                print(f"   Vaccination info length: {len(response['vaccination_info'])} characters")
            else:
                all_passed = False
                
            time.sleep(1)
        
        return all_passed

    def test_health_alerts(self):
        """Test health alerts endpoint"""
        success, response = self.run_test(
            "Health Alerts",
            "GET",
            "api/health-alerts?location=india&language=english",
            200
        )
        
        if success and isinstance(response, dict) and 'health_alerts' in response:
            print(f"   Health alerts length: {len(response['health_alerts'])} characters")
            return True
        
        return False

    def test_conversation_history(self):
        """Test conversation history endpoint"""
        success, response = self.run_test(
            "Conversation History",
            "GET",
            f"api/conversation-history/{self.session_id}",
            200
        )
        
        if success and isinstance(response, dict):
            conversations = response.get('conversations', [])
            print(f"   Found {len(conversations)} conversations in history")
            return True
        
        return False

    def test_image_analysis(self):
        """Test image analysis endpoint (with dummy image)"""
        # Create a simple test image data
        import io
        from PIL import Image
        
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {'image': ('test.jpg', img_bytes, 'image/jpeg')}
        data = {
            'question': 'What can you tell me about this image?',
            'language': 'english',
            'session_id': self.session_id
        }
        
        success, response = self.run_test(
            "Image Analysis",
            "POST",
            "api/analyze-image",
            200,
            data=data,
            files=files
        )
        
        if success and isinstance(response, dict) and 'analysis' in response:
            print(f"   Analysis length: {len(response['analysis'])} characters")
            return True
        
        return False

    def test_voice_to_text(self):
        """Test voice to text endpoint (placeholder)"""
        # Create dummy audio data
        import io
        
        audio_data = io.BytesIO(b"dummy audio data")
        files = {'audio': ('test.wav', audio_data, 'audio/wav')}
        data = {
            'language': 'english',
            'session_id': self.session_id
        }
        
        success, response = self.run_test(
            "Voice to Text",
            "POST",
            "api/voice-to-text",
            200,
            data=data,
            files=files
        )
        
        if success and isinstance(response, dict) and 'transcribed_text' in response:
            print(f"   Transcribed text: {response['transcribed_text']}")
            return True
        
        return False

def main():
    print("🏥 AI Health Chatbot API Testing Suite")
    print("=" * 50)
    
    tester = HealthChatbotAPITester()
    
    # Run all tests
    test_results = []
    
    print("\n📋 Running Basic API Tests...")
    test_results.append(tester.test_health_check())
    test_results.append(tester.test_supported_languages())
    
    print("\n💬 Running Chat Functionality Tests...")
    test_results.append(tester.test_chat_functionality())
    
    print("\n🏥 Running Health Feature Tests...")
    test_results.append(tester.test_vaccination_reminders())
    test_results.append(tester.test_health_alerts())
    
    print("\n📊 Running Advanced Feature Tests...")
    test_results.append(tester.test_conversation_history())
    test_results.append(tester.test_image_analysis())
    test_results.append(tester.test_voice_to_text())
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! API is working correctly.")
        return 0
    else:
        failed_tests = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed_tests} test(s) failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())