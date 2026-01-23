from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .engines.birth_destiny_engine import BirthDestinyEngine
from .engines.personal_year_engine import PersonalYearEngine
from .engines.compatibility_engine import CompatibilityEngine
from .engines.lo_shu_engine import LoShuEngine
from .engines.compound_interpreter import CompoundInterpreter
from .engines.business_engine import BusinessEngine
from .engines.kua_engine import KuaEngine
from .engines.health_kabala_engine import HealthKabalaEngine

@api_view(['POST'])
@permission_classes([AllowAny])
def core_numbers_view(request):
    day = request.data.get('day')
    month = request.data.get('month')
    year = request.data.get('year')
    
    if not all([day, month, year]):
        return Response({"error": "Missing day, month or year"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = BirthDestinyEngine()
    result = engine.calculate(int(day), int(month), int(year))
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def predictive_yearly_view(request):
    birth_day = request.data.get('birth_day')
    birth_month = request.data.get('birth_month')
    birth_year = request.data.get('birth_year')
    target_year = request.data.get('target_year')
    driver_number = request.data.get('driver_number') # Usually birth number
    
    if not all([birth_day, birth_month, birth_year, target_year, driver_number]):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = PersonalYearEngine()
    result = engine.calculate(int(birth_day), int(birth_month), int(target_year), int(birth_year), int(driver_number))
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def compatibility_check_81_view(request):
    person1 = request.data.get('person1')
    person2 = request.data.get('person2')
    
    if not person1 or not person2:
        return Response({"error": "Missing person1 or person2 data"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = CompatibilityEngine()
    result = engine.calculate(person1, person2)
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def lo_shu_analyze_view(request):
    birth_date = request.data.get('birth_date') # YYYY-MM-DD
    if not birth_date:
        return Response({"error": "Missing birth_date"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = LoShuEngine()
    result = engine.calculate(birth_date)
    return Response(result)

@api_view(['GET'])
@permission_classes([AllowAny])
def compound_number_view(request, number):
    engine = CompoundInterpreter()
    result = engine.interpret(int(number))
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def business_analyze_view(request):
    business_name = request.data.get('business_name')
    owner_birth_number = request.data.get('owner_birth_number')
    
    if not business_name or owner_birth_number is None:
        return Response({"error": "Missing business_name or owner_birth_number"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = BusinessEngine()
    result = engine.calculate(business_name, int(owner_birth_number))
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def feng_shui_kua_view(request):
    year = request.data.get('year')
    gender = request.data.get('gender')
    
    if not year or not gender:
        return Response({"error": "Missing year or gender"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = KuaEngine()
    result = engine.calculate(int(year), gender)
    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def health_kabala_view(request):
    name = request.data.get('name')
    if not name:
        return Response({"error": "Missing name"}, status=status.HTTP_400_BAD_REQUEST)
    
    engine = HealthKabalaEngine()
    result = engine.calculate(name)
    return Response(result)
