from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .engines import (
    BirthDestinyEngine,
    PersonalYearEngine,
    CompatibilityEngine,
    LoShuEngine,
    CompoundInterpreter,
    BusinessEngine,
    KuaEngine,
    HealthKabalaEngine,
    ValidationMode
)
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def core_numbers_view(request):
    """
    Calculate Birth and Destiny numbers with conflict resolution.
    
    Request body:
    {
        "day": 15,
        "month": 6,
        "year": 1990,
        "enable_validation": false  # Optional: include validation report
    }
    """
    day = request.data.get('day')
    month = request.data.get('month')
    year = request.data.get('year')
    enable_validation = request.data.get('enable_validation', False)
    
    if not all([day, month, year]):
        return Response({"error": "Missing day, month or year"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = BirthDestinyEngine()
        result = engine.calculate(int(day), int(month), int(year))
        
        # Add validation mode if requested
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='BirthDestinyEngine',
                calculation_type='birth_destiny',
                inputs={'day': day, 'month': month, 'year': year},
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in core_numbers_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def predictive_yearly_view(request):
    """
    Calculate Personal Year and Eventful Year with conflict resolution.
    
    Request body:
    {
        "birth_day": 15,
        "birth_month": 6,
        "birth_year": 1990,
        "target_year": 2025,
        "driver_number": 3,
        "compound_number": 60,  # Optional: for conflict resolution
        "enable_validation": false
    }
    """
    birth_day = request.data.get('birth_day')
    birth_month = request.data.get('birth_month')
    birth_year = request.data.get('birth_year')
    target_year = request.data.get('target_year')
    driver_number = request.data.get('driver_number')
    compound_number = request.data.get('compound_number')
    enable_validation = request.data.get('enable_validation', False)
    
    if not all([birth_day, birth_month, birth_year, target_year, driver_number]):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = PersonalYearEngine()
        result = engine.calculate(
            int(birth_day), 
            int(birth_month), 
            int(target_year), 
            int(birth_year), 
            int(driver_number),
            compound_number=int(compound_number) if compound_number else None
        )
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='PersonalYearEngine',
                calculation_type='personal_year',
                inputs=request.data,
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in predictive_yearly_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def compatibility_check_81_view(request):
    """
    Check compatibility using 81-combination rules with conflict resolution.
    
    Request body:
    {
        "psychic1": 1,  # Person 1 psychic number (driver)
        "destiny1": 5,  # Person 1 destiny number (conductor)
        "psychic2": 8,  # Person 2 psychic number (optional, for partner compatibility)
        "destiny2": 2,  # Person 2 destiny number (optional)
        "enable_validation": false
    }
    """
    psychic1 = request.data.get('psychic1')
    destiny1 = request.data.get('destiny1')
    psychic2 = request.data.get('psychic2')
    destiny2 = request.data.get('destiny2')
    enable_validation = request.data.get('enable_validation', False)
    
    if not psychic1 or not destiny1:
        return Response({"error": "Missing psychic1 or destiny1"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = CompatibilityEngine()
        result = engine.check_compatibility(
            int(psychic1),
            int(destiny1),
            int(psychic2) if psychic2 else None,
            int(destiny2) if destiny2 else None
        )
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='CompatibilityEngine',
                calculation_type='compatibility_81',
                inputs=request.data,
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in compatibility_check_81_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def lo_shu_analyze_view(request):
    """
    Analyze Lo Shu Grid and Missing Numbers with conflict resolution.
    
    Request body:
    {
        "dob_day": 15,
        "dob_month": 6,
        "dob_year": 1990,
        "driver": 3,      # Birth number
        "conductor": 9,   # Destiny number
        "birth_number": 3,  # Optional: for conflict resolution
        "destiny_number": 9,  # Optional: for conflict resolution
        "enable_validation": false
    }
    """
    dob_day = request.data.get('dob_day')
    dob_month = request.data.get('dob_month')
    dob_year = request.data.get('dob_year')
    driver = request.data.get('driver')
    conductor = request.data.get('conductor')
    birth_number = request.data.get('birth_number')
    destiny_number = request.data.get('destiny_number')
    enable_validation = request.data.get('enable_validation', False)
    
    if not all([dob_day, dob_month, dob_year, driver, conductor]):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = LoShuEngine()
        result = engine.calculate_grid(
            int(dob_day),
            int(dob_month),
            int(dob_year),
            int(driver),
            int(conductor),
            birth_number=int(birth_number) if birth_number else None,
            destiny_number=int(destiny_number) if destiny_number else None
        )
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='LoShuEngine',
                calculation_type='lo_shu_grid',
                inputs=request.data,
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in lo_shu_analyze_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def compound_number_view(request, number=None):
    """
    Interpret compound number with conflict resolution.
    
    GET /engines/compound/<number>/
    POST body:
    {
        "number": 60,
        "prominent_numbers": [4, 6, 9],  # Optional
        "destiny_number": 5,              # Optional
        "birth_number": 3,                # Optional
        "enable_validation": false
    }
    """
    if request.method == 'POST':
        number = request.data.get('number', number)
    
    if not number:
        return Response({"error": "Missing compound number"}, status=status.HTTP_400_BAD_REQUEST)
    
    prominent_numbers = request.data.get('prominent_numbers', []) if request.method == 'POST' else []
    destiny_number = request.data.get('destiny_number') if request.method == 'POST' else None
    birth_number = request.data.get('birth_number') if request.method == 'POST' else None
    enable_validation = request.data.get('enable_validation', False) if request.method == 'POST' else False
    
    try:
        engine = CompoundInterpreter()
        result = engine.interpret(
            int(number),
            prominent_numbers=[int(n) for n in prominent_numbers] if prominent_numbers else None,
            destiny_number=int(destiny_number) if destiny_number else None,
            birth_number=int(birth_number) if birth_number else None
        )
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='CompoundInterpreter',
                calculation_type='compound_number',
                inputs={'number': number, 'prominent_numbers': prominent_numbers},
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in compound_number_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def business_analyze_view(request):
    """
    Analyze business name and mobile number with conflict resolution.
    
    Request body:
    {
        "company_name": "ABC PVT LTD",
        "birth_number": 4,
        "destiny_number": 7,      # Optional
        "phone_number": "9876543210",  # Optional: for mobile analysis
        "enable_validation": false
    }
    """
    company_name = request.data.get('company_name')
    birth_number = request.data.get('birth_number') or request.data.get('owner_birth_number')
    destiny_number = request.data.get('destiny_number')
    phone_number = request.data.get('phone_number')
    enable_validation = request.data.get('enable_validation', False)
    
    if not company_name or birth_number is None:
        return Response({"error": "Missing company_name or birth_number"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = BusinessEngine()
        result = {}
        
        # Analyze business name
        name_result = engine.analyze_business(
            company_name,
            int(birth_number),
            int(destiny_number) if destiny_number else None
        )
        result['business_name_analysis'] = name_result
        
        # Analyze mobile if provided
        if phone_number:
            mobile_result = engine.analyze_mobile(
                str(phone_number),
                int(birth_number)
            )
            result['mobile_analysis'] = mobile_result
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='BusinessEngine',
                calculation_type='business_analysis',
                inputs=request.data,
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in business_analyze_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def feng_shui_kua_view(request):
    """
    Calculate Kua number and Feng Shui directions with conflict resolution.
    
    Request body:
    {
        "birth_year": 1990,
        "gender": "male",  # or "female"
        "enable_validation": false
    }
    """
    birth_year = request.data.get('birth_year') or request.data.get('year')
    gender = request.data.get('gender')
    enable_validation = request.data.get('enable_validation', False)
    
    if not birth_year or not gender:
        return Response({"error": "Missing birth_year or gender"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = KuaEngine()
        result = engine.calculate_kua(int(birth_year), gender)
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='KuaEngine',
                calculation_type='kua_number',
                inputs={'birth_year': birth_year, 'gender': gender},
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in feng_shui_kua_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def health_kabala_view(request):
    """
    Calculate Health & Kabala name analysis with conflict resolution.
    
    Request body:
    {
        "name": "JOHN",
        "birth_number": 5,  # Optional: for conflict resolution
        "enable_validation": false
    }
    """
    name = request.data.get('name')
    birth_number = request.data.get('birth_number')
    enable_validation = request.data.get('enable_validation', False)
    
    if not name:
        return Response({"error": "Missing name"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        engine = HealthKabalaEngine()
        result = engine.calculate_health(
            name,
            birth_number=int(birth_number) if birth_number else None
        )
        
        if enable_validation:
            validation_mode = ValidationMode()
            validation_mode.validate_calculation(
                engine_name='HealthKabalaEngine',
                calculation_type='health_kabala',
                inputs={'name': name, 'birth_number': birth_number},
                outputs=result,
                deterministic=True
            )
            result['validation_report'] = validation_mode.generate_validation_report()
        
        return Response(result, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in health_kabala_view: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
