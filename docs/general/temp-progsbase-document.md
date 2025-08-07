
// Downloaded from https://repo.progsbase.com - Code Developed Using progsbase.

class WriterSettings{
	prettyprint : boolean;
	humanreadable : boolean;
	binary : boolean;
	level : number;
	indentString : string [];
}
class Example{
	a : string [];
	b : number [];
	x : X;
}
class X{
	x1 : string [];
	x1IsNull : boolean;
	x2 : boolean;
	x3 : boolean;
}
class BooleanArrayReference{
	booleanArray : boolean [];
}
class BooleanReference{
	booleanValue : boolean;
}
class CharacterReference{
	characterValue : string;
}
class NumberArrayReference{
	numberArray : number [];
}
class NumberReference{
	numberValue : number;
}
class StringArrayReference{
	stringArray : StringReference [];
}
class StringReference{
	stringx : string [];
}
class Arrayx{
	array : Data [];
	length : number;
}
class Data{
	isStruture : boolean;
	isArray : boolean;
	isNumber : boolean;
	isString : boolean;
	isBoolean : boolean;
	structure : Structure;
	array : Arrayx;
	numberx : number;
	booleanxx : boolean;
	stringx : string [];
}
class DataReference{
	data : Data;
}
class Structure{
	keys : Arrayx;
	values : Arrayx;
}
class DynamicArrayCharacters{
	array : string [];
	length : number;
}
class LinkedListNodeStrings{
	end : boolean;
	value : string [];
	next : LinkedListNodeStrings;
}
class LinkedListStrings{
	first : LinkedListNodeStrings;
	last : LinkedListNodeStrings;
}
class LinkedListNodeNumbers{
	next : LinkedListNodeNumbers;
	end : boolean;
	value : number;
}
class LinkedListNumbers{
	first : LinkedListNodeNumbers;
	last : LinkedListNodeNumbers;
}
class LinkedListCharacters{
	first : LinkedListNodeCharacters;
	last : LinkedListNodeCharacters;
}
class LinkedListNodeCharacters{
	end : boolean;
	value : string;
	next : LinkedListNodeCharacters;
}
class DynamicArrayNumbers{
	array : number [];
	length : number;
}
	function JSONCompare(a : string [], b : string [], epsilon : number, equal : BooleanReference, message : StringReference) : boolean{
		var success : boolean;
		var eaRef : DataReference, ebRef : DataReference;
		var ea : Data, eb : Data;

		eaRef = new DataReference();
		ebRef = new DataReference();

		success = ReadJSON(a, eaRef, message);

		if(success){
			ea = eaRef.data;

			success = ReadJSON(b, ebRef, message);

			if(success){
				eb = ebRef.data;

				equal.booleanValue = JSONCompareElements(ea, eb, epsilon);

				FreeData(eb);
			}

			FreeData(ea);
		}

		return success;
	}


	function JSONCompareElements(ea : Data, eb : Data, epsilon : number) : boolean{
		var equal : boolean;

		equal = DataTypeEquals(ea, eb);
        
		if(equal){
			if(IsStructure(ea)){
				equal = JSONCompareObjects(ea.structure, eb.structure, epsilon);
			}else if(IsString(ea)){
				equal = StringsEqual(ea.stringx, eb.stringx);
			}else if(IsArray(ea)){
				equal = JSONCompareArrays(ea.array, eb.array, epsilon);
			}else if(IsNumber(ea)){
				equal = EpsilonCompare(ea.numberx, eb.numberx, epsilon);
			}else if(IsNoType(ea)){
				equal = true;
			}else if(IsBoolean(ea)){
				equal = ea.booleanxx == eb.booleanxx;
			}
		}
        
		return equal;
	}


	function JSONCompareArrays(ea : Arrayx, eb : Arrayx, epsilon : number) : boolean{
		var equals : boolean;
		var i : number, length : number;

		equals = ea.length == eb.length;

		if(equals){
			length = ea.length;
			for(i = 0; i < length && equals; i = i + 1){
				equals = JSONCompareElements(ArrayIndex(ea, i), ArrayIndex(eb, i), epsilon);
			}
		}

		return equals;
	}


	function JSONCompareObjects(ea : Structure, eb : Structure, epsilon : number) : boolean{
		var equals : boolean;
		var akeys : number, bkeys : number, i : number;
		var keys : StringReference [];
		var key : string [];
		var aFoundReference : BooleanReference, bFoundReference : BooleanReference;
		var eaValue : Data, ebValue : Data;

		aFoundReference = new BooleanReference();
		bFoundReference = new BooleanReference();

		akeys = StructKeys(ea);
		bkeys = StructKeys(eb);

		equals = akeys == bkeys;

		if(equals){
			keys = GetStructKeys(ea);

			for(i = 0; i < keys.length && equals; i = i + 1){
				key = keys[i].stringx;

				eaValue = GetDataFromStructWithCheck(ea, key, aFoundReference);
				ebValue = GetDataFromStructWithCheck(eb, key, bFoundReference);

				if(aFoundReference.booleanValue && bFoundReference.booleanValue){
					equals = JSONCompareElements(eaValue, ebValue, epsilon);
				}else{
					equals = false;
				}
			}

			FreeStringReferenceArray(keys);
		}

		return equals;
	}


	function FreeStringReferenceArray(strings : StringReference []) : void{
		var i : number;

		for(i = 0; i < strings.length; i = i + 1){
			delete strings[i];
		}
		strings = undefined;
	}


	function WriteJSON(data : Data) : string []{
		var writerSettings : WriterSettings;

		writerSettings = CreateDefaultWriterSettings();

		return WriteJSONWithOptions(data, writerSettings);
	}


	function WriteJSONPretty(data : Data) : string []{
		var writerSettings : WriterSettings;

		writerSettings = CreateDefaultWriterSettings();
		writerSettings.prettyprint = true;

		return WriteJSONWithOptions(data, writerSettings);
	}


	function WriteJSONPrettyBinary(data : Data) : string []{
		var writerSettings : WriterSettings;

		writerSettings = CreateDefaultWriterSettings();
		writerSettings.prettyprint = true;
		writerSettings.humanreadable = true;
		writerSettings.binary = true;

		return WriteJSONWithOptions(data, writerSettings);
	}


	function CreateDefaultWriterSettings() : WriterSettings{
		var writerSettings : WriterSettings;

		writerSettings = new WriterSettings();
		writerSettings.prettyprint = false;
		writerSettings.humanreadable = false;
		writerSettings.binary = false;
		writerSettings.level = 0;
		writerSettings.indentString = "  ".split('');

		return writerSettings;
	}


	function WriteJSONWithOptions(data : Data, settings : WriterSettings) : string []{
		var da : DynamicArrayCharacters;
		var result : string [];

		da = CreateDynamicArrayCharacters();

		if(IsStructure(data)){
			WriteObject(data, da, settings);
		}else if(IsString(data)){
			WriteString(data, da);
		}else if(IsArray(data)){
			WriteArray(data, da, settings);
		}else if(IsNumber(data)){
			WriteNumber(data, da, settings);
		}else if(IsNoType(data)){
			DynamicArrayAddString(da, "null".split(''));
		}else if(IsBoolean(data)){
			WriteBooleanValue(data, da);
		}

		result = DynamicArrayCharactersToArray(da);

		return result;
	}


	function WriteBooleanValue(element : Data, da : DynamicArrayCharacters) : void{
		if(element.booleanxx){
			DynamicArrayAddString(da, "true".split(''));
		}else{
			DynamicArrayAddString(da, "false".split(''));
		}
	}


	function WriteNumber(element : Data, da : DynamicArrayCharacters, settings : WriterSettings) : void{
		var numberString : string [];

		if(settings.humanreadable){
			if(settings.binary){
				numberString = nNumberToHumanReadableBinary(element.numberx);
			}else{
				numberString = nNumberToHumanReadableShortScale(element.numberx);
			}
		}else if(element.numberx != 0){
			if(Math.abs(element.numberx) >= 10**15 || Math.abs(element.numberx) <= 10**(-15)){
				numberString = nCreateStringScientificNotationDecimalFromNumber(element.numberx);
			}else{
				numberString = nCreateStringDecimalFromNumber(element.numberx);
			}
		}else{
			numberString = nCreateStringDecimalFromNumber(element.numberx);
		}

		if(settings.humanreadable){
			DynamicArrayAddCharacter(da, '\"');
		}
		DynamicArrayAddString(da, numberString);
		if(settings.humanreadable){
			DynamicArrayAddCharacter(da, '\"');
		}
	}


	function WriteArray(data : Data, da : DynamicArrayCharacters, settings : WriterSettings) : void{
		var s : string [];
		var entry : Data;
		var i : number, j : number;

		DynamicArrayAddString(da, "[".split(''));

		if(settings.prettyprint){
			settings.level = settings.level + 1;
			if(data.array.length > 0){
				DynamicArrayAddCharacter(da, '\n');
			}
		}

		for(i = 0; i < data.array.length; i = i + 1){
			entry = ArrayIndex(data.array, i);

			if(settings.prettyprint){
				for(j = 0; j < settings.level; j = j + 1){
					DynamicArrayAddString(da, settings.indentString);
				}
			}

			s = WriteJSONWithOptions(entry, settings);
			DynamicArrayAddString(da, s);

			if(i + 1 != data.array.length){
				DynamicArrayAddString(da, ",".split(''));
				if(settings.prettyprint){
					DynamicArrayAddString(da, "\n".split(''));
				}
			}
		}

		if(settings.prettyprint){
			settings.level = settings.level - 1;
			if(data.array.length > 0){
				DynamicArrayAddCharacter(da, '\n');
				for(i = 0; i < settings.level; i = i + 1){
					DynamicArrayAddString(da, settings.indentString);
				}
			}
		}

		DynamicArrayAddString(da, "]".split(''));
	}


	function WriteString(element : Data, da : DynamicArrayCharacters) : void{
		var str : string [];

		DynamicArrayAddString(da, "\"".split(''));
		str = JSONEscapeString(element.stringx);
		DynamicArrayAddString(da, str);
		DynamicArrayAddString(da, "\"".split(''));

		str = undefined;
	}


	function JSONEscapeString(stringx : string []) : string []{
		var i : number, length : number;
		var index : NumberReference, lettersReference : NumberReference;
		var ns : string [], escaped : string [];

		length = JSONEscapedStringLength(stringx);

		ns = new Array<string>(length);
		index = CreateNumberReference(0);
		lettersReference = CreateNumberReference(0);

		for(i = 0; i < stringx.length; i = i + 1){
			if(JSONMustBeEscaped(stringx[i], lettersReference)){
				escaped = JSONEscapeCharacter(stringx[i]);
				strWriteStringToStingStream(ns, index, escaped);
			}else{
				strWriteCharacterToStingStream(ns, index, stringx[i]);
			}
		}

		return ns;
	}


	function JSONEscapedStringLength(stringx : string []) : number{
		var lettersReference : NumberReference;
		var i : number, length : number;

		lettersReference = CreateNumberReference(0);
		length = 0;

		for(i = 0; i < stringx.length; i = i + 1){
			if(JSONMustBeEscaped(stringx[i], lettersReference)){
				length = length + lettersReference.numberValue;
			}else{
				length = length + 1;
			}
		}
		return length;
	}


	function JSONEscapeCharacter(c : string) : string []{
		var code : number;
		var escaped : string [];
		var hexNumber : StringReference;
		var q : number, rs : number, s : number, b : number, f : number, n : number, r : number, t : number;

		code = c.charCodeAt(0);

		q = 34;
		rs = 92;
		s = 47;
		b = 8;
		f = 12;
		n = 10;
		r = 13;
		t = 9;

		hexNumber = new StringReference();

		if(code == q){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = '\"';
		}else if(code == rs){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = '\\';
		}else if(code == s){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = '/';
		}else if(code == b){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = 'b';
		}else if(code == f){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = 'f';
		}else if(code == n){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = 'n';
		}else if(code == r){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = 'r';
		}else if(code == t){
			escaped = new Array<string>(2);
			escaped[0] = '\\';
			escaped[1] = 't';
		}else if(code >= 0 && code <= 31){
			escaped = new Array<string>(6);
			escaped[0] = '\\';
			escaped[1] = 'u';
			escaped[2] = '0';
			escaped[3] = '0';

			nCreateStringFromNumberWithCheck(code, 16, hexNumber);

			if(hexNumber.stringx.length == 1){
				escaped[4] = '0';
				escaped[5] = hexNumber.stringx[0];
			}else if(hexNumber.stringx.length == 2){
				escaped[4] = hexNumber.stringx[0];
				escaped[5] = hexNumber.stringx[1];
			}
		}else{
			escaped = new Array<string>(1);
			escaped[0] = c;
		}

		return escaped;
	}


	function JSONMustBeEscaped(c : string, letters : NumberReference) : boolean{
		var code : number;
		var mustBeEscaped : boolean;
		var q : number, rs : number, s : number, b : number, f : number, n : number, r : number, t : number;

		code = c.charCodeAt(0);
		mustBeEscaped = false;

		q = 34;
		rs = 92;
		s = 47;
		b = 8;
		f = 12;
		n = 10;
		r = 13;
		t = 9;

		if(code == q || code == rs || code == s || code == b || code == f || code == n || code == r || code == t){
			mustBeEscaped = true;
			letters.numberValue = 2;
		}else if(code >= 0 && code <= 31){
			mustBeEscaped = true;
			letters.numberValue = 6;
		}else if(code >= 2**16){
			mustBeEscaped = true;
			letters.numberValue = 6;
		}

		return mustBeEscaped;
	}


	function WriteObject(data : Data, da : DynamicArrayCharacters, settings : WriterSettings) : void{
		var s : string [], key : string [], escapedKey : string [];
		var i : number, j : number;
		var keys : StringReference [];
		var objectElement : Data;

		DynamicArrayAddString(da, "{".split(''));

		keys = GetStructKeys(data.structure);

		if(settings.prettyprint){
			settings.level = settings.level + 1;
			if(keys.length > 0){
				DynamicArrayAddCharacter(da, '\n');
			}
		}

		for(i = 0; i < keys.length; i = i + 1){
			key = keys[i].stringx;
			objectElement = GetDataFromStruct(data.structure, key);

			if(settings.prettyprint){
				for(j = 0; j < settings.level; j = j + 1){
					DynamicArrayAddString(da, settings.indentString);
				}
			}

			escapedKey = JSONEscapeString(key);
			DynamicArrayAddString(da, "\"".split(''));
			DynamicArrayAddString(da, escapedKey);
			DynamicArrayAddString(da, "\"".split(''));
			DynamicArrayAddString(da, ":".split(''));

			if(settings.prettyprint){
				DynamicArrayAddString(da, " ".split(''));
			}

			s = WriteJSONWithOptions(objectElement, settings);
			DynamicArrayAddString(da, s);

			if(i + 1 != keys.length){
				DynamicArrayAddString(da, ",".split(''));
				if(settings.prettyprint){
					DynamicArrayAddCharacter(da, '\n');
				}
			}
		}

		if(settings.prettyprint){
			settings.level = settings.level - 1;
			if(keys.length > 0){
				DynamicArrayAddCharacter(da, '\n');
				for(i = 0; i < settings.level; i = i + 1){
					DynamicArrayAddString(da, settings.indentString);
				}
			}
		}

		DynamicArrayAddCharacter(da, '}');
	}


	function WriteJSONFromStruct(struct : Structure) : string []{
		var data : Data;
		var json : string [];

		data = CreateNewStructData();
		data.structure = struct;
		json = WriteJSON(data);

		return json;
	}


	function WriteJSONFromArray(array : Arrayx) : string []{
		var data : Data;
		var json : string [];

		data = CreateNewArrayData();
		data.array = array;
		json = WriteJSON(data);

		return json;
	}


	function ReadJSON(stringx : string [], dataReference : DataReference, message : StringReference) : boolean{
		var tokenArrayReference : StringArrayReference;
		var success : boolean;

		/* Tokenize.*/
		tokenArrayReference = new StringArrayReference();
		success = JSONTokenize(stringx, tokenArrayReference, message);

		if(success){
			/* Parse.*/
			success = GetJSONValue(tokenArrayReference.stringArray, dataReference, message);
		}

		return success;
	}


	function GetJSONValue(tokens : StringReference [], dataReference : DataReference, message : StringReference) : boolean{
		var i : NumberReference;
		var success : boolean;

		i = CreateNumberReference(0);
		success = GetJSONValueRecursive(tokens, i, 0, dataReference, message);

		return success;
	}


	function GetJSONValueRecursive(tokens : StringReference [], i : NumberReference, depth : number, dataReference : DataReference, message : StringReference) : boolean{
		var str : string [], substr : string [], token : string [];
		var stringToDecimalResult : number;
		var success : boolean;

		success = true;
		token = tokens[i.numberValue].stringx;

		if(StringsEqual(token, "{".split(''))){
			success = GetJSONObject(tokens, i, depth + 1, dataReference, message);
		}else if(StringsEqual(token, "[".split(''))){
			success = GetJSONArray(tokens, i, depth + 1, dataReference, message);
		}else if(StringsEqual(token, "true".split(''))){
			dataReference.data = CreateBooleanData(true);
			i.numberValue = i.numberValue + 1;
		}else if(StringsEqual(token, "false".split(''))){
			dataReference.data = CreateBooleanData(false);
			i.numberValue = i.numberValue + 1;
		}else if(StringsEqual(token, "null".split(''))){
			dataReference.data = CreateNoTypeData();
			i.numberValue = i.numberValue + 1;
		}else if(charIsNumber(token[0]) || token[0] == '-'){
			stringToDecimalResult = nCreateNumberFromDecimalString(token);
			dataReference.data = CreateNumberData(stringToDecimalResult);
			i.numberValue = i.numberValue + 1;
		}else if(token[0] == '\"'){
			substr = strSubstring(token, 1, token.length - 1);
			dataReference.data = CreateStringData(substr);
			i.numberValue = i.numberValue + 1;
		}else{
			str = "".split('');
			str = strConcatenateString(str, "Invalid token first in value: ".split(''));
			str = strAppendString(str, token);
			message.stringx = str;
			success = false;
		}

		if(success && depth == 0){
			if(StringsEqual(tokens[i.numberValue].stringx, "<end>".split(''))){
			}else{
				message.stringx = "The outer value cannot have any tokens following it.".split('');
				success = false;
			}
		}

		return success;
	}


	function GetJSONObject(tokens : StringReference [], i : NumberReference, depth : number, dataReference : DataReference, message : StringReference) : boolean{
		var data : Data, value : Data;
		var done : boolean, success : boolean;
		var key : string [], colon : string [], comma : string [], closeCurly : string [];
		var keystring : string [], str : string [];
		var valueReference : DataReference;

		data = CreateNewStructData();
		valueReference = new DataReference();
		success = true;
		i.numberValue = i.numberValue + 1;

		if(!StringsEqual(tokens[i.numberValue].stringx, "}".split(''))){
			done = false;

			for(; !done && success; ){
				key = tokens[i.numberValue].stringx;

				if(key[0] == '\"'){
					i.numberValue = i.numberValue + 1;
					colon = tokens[i.numberValue].stringx;
					if(StringsEqual(colon, ":".split(''))){
						i.numberValue = i.numberValue + 1;
						success = GetJSONValueRecursive(tokens, i, depth, valueReference, message);

						if(success){
							keystring = strSubstring(key, 1, key.length - 1);
							value = valueReference.data;

							AddDataToStruct(data.structure, keystring, value);

							comma = tokens[i.numberValue].stringx;
							if(StringsEqual(comma, ",".split(''))){
								/* OK*/
								i.numberValue = i.numberValue + 1;
							}else{
								done = true;
							}
						}
					}else{
						str = "".split('');
						str = strConcatenateString(str, "Expected colon after key in object: ".split(''));
						str = strAppendString(str, colon);
						message.stringx = str;

						success = false;
						done = true;
					}
				}else{
					message.stringx = "Expected string as key in object.".split('');

					done = true;
					success = false;
				}
			}
		}

		if(success){
			closeCurly = tokens[i.numberValue].stringx;

			if(StringsEqual(closeCurly, "}".split(''))){
				/* OK*/
				dataReference.data = data;
				i.numberValue = i.numberValue + 1;
			}else{
				message.stringx = "Expected close curly brackets at end of object value.".split('');
				success = false;
			}
		}

		valueReference = undefined;

		return success;
	}


	function GetJSONArray(tokens : StringReference [], i : NumberReference, depth : number, dataReference : DataReference, message : StringReference) : boolean{
		var data : Data, value : Data;
		var nextToken : string [], comma : string [];
		var done : boolean, success : boolean;
		var valueReference : DataReference;

		i.numberValue = i.numberValue + 1;

		valueReference = new DataReference();
		success = true;
		data = CreateNewArrayData();

		nextToken = tokens[i.numberValue].stringx;

		if(!StringsEqual(nextToken, "]".split(''))){
			done = false;
			for(; !done && success; ){
				success = GetJSONValueRecursive(tokens, i, depth, valueReference, message);

				if(success){
					value = valueReference.data;
					AddDataToArray(data.array, value);

					comma = tokens[i.numberValue].stringx;

					if(StringsEqual(comma, ",".split(''))){
						/* OK*/
						i.numberValue = i.numberValue + 1;
					}else{
						done = true;
					}
				}
			}
		}

		nextToken = tokens[i.numberValue].stringx;
		if(StringsEqual(nextToken, "]".split(''))){
			/* OK*/
			i.numberValue = i.numberValue + 1;
		}else{
			message.stringx = "Expected close square bracket at end of array.".split('');
			success = false;
		}

		dataReference.data = data;
		valueReference = undefined;

		return success;
	}


	function JSONTokenize(json : string [], tokensReference : StringArrayReference, message : StringReference) : boolean{
		var i : number;
		var c : string;
		var str : string [];
		var stringReference : StringReference, tokenReference : StringReference;
		var stringLength : NumberReference;
		var success : boolean;
		var ll : Arrayx;

		ll = CreateArray();
		success = true;

		stringLength = new NumberReference();
		tokenReference = new StringReference();

		for(i = 0; i < json.length && success; ){
			c = json[i];

			if(c == '{'){
				AddStringToArray(ll, "{".split(''));
				i = i + 1;
			}else if(c == '}'){
				AddStringToArray(ll, "}".split(''));
				i = i + 1;
			}else if(c == '['){
				AddStringToArray(ll, "[".split(''));
				i = i + 1;
			}else if(c == ']'){
				AddStringToArray(ll, "]".split(''));
				i = i + 1;
			}else if(c == ':'){
				AddStringToArray(ll, ":".split(''));
				i = i + 1;
			}else if(c == ','){
				AddStringToArray(ll, ",".split(''));
				i = i + 1;
			}else if(c == 'f'){
				success = GetJSONPrimitiveName(json, i, message, "false".split(''), tokenReference);
				if(success){
					AddStringToArray(ll, "false".split(''));
					i = i + "false".split('').length;
				}
			}else if(c == 't'){
				success = GetJSONPrimitiveName(json, i, message, "true".split(''), tokenReference);
				if(success){
					AddStringToArray(ll, "true".split(''));
					i = i + "true".split('').length;
				}
			}else if(c == 'n'){
				success = GetJSONPrimitiveName(json, i, message, "null".split(''), tokenReference);
				if(success){
					AddStringToArray(ll, "null".split(''));
					i = i + "null".split('').length;
				}
			}else if(c == ' ' || c == '\n' || c == '\t' || c == '\r'){
				/* Skip.*/
				i = i + 1;
			}else if(c == '\"'){
				success = GetJSONString(json, i, tokenReference, stringLength, message);
				if(success){
					AddStringToArray(ll, tokenReference.stringx);
					i = i + stringLength.numberValue;
				}
			}else if(IsJSONNumberCharacter(c)){
				success = GetJSONNumberToken(json, i, tokenReference, message);
				if(success){
					AddStringToArray(ll, tokenReference.stringx);
					i = i + tokenReference.stringx.length;
				}
			}else{
				str = strConcatenateCharacter("Invalid start of Token: ".split(''), c);
				stringReference = CreateStringReference(str);
				message.stringx = stringReference.stringx;
				i = i + 1;
				success = false;
			}
		}

		if(success){
			AddStringToArray(ll, "<end>".split(''));
			tokensReference.stringArray = ToStaticStringArray(ll);
			FreeArray(ll);
		}

		return success;
	}


	function GetJSONNumberToken(json : string [], start : number, tokenReference : StringReference, message : StringReference) : boolean{
		var c : string;
		var end : number, i : number;
		var done : boolean, success : boolean;
		var numberString : string [];

		end = json.length;
		done = false;

		for(i = start; i < json.length && !done; i = i + 1){
			c = json[i];
			if(!IsJSONNumberCharacter(c)){
				done = true;
				end = i;
			}
		}

		numberString = strSubstring(json, start, end);

		success = IsValidJSONNumber(numberString, message);

		tokenReference.stringx = numberString;

		return success;
	}


	function IsValidJSONNumber(n : string [], message : StringReference) : boolean{
		var success : boolean;
		var i : number;

		i = 0;

		/* JSON allows an optional negative sign.*/
		if(n[i] == '-'){
			i = i + 1;
		}

		if(i < n.length){
			success = IsValidJSONNumberAfterSign(n, i, message);
		}else{
			success = false;
			message.stringx = "Number must contain at least one digit.".split('');
		}

		return success;
	}


	function IsValidJSONNumberAfterSign(n : string [], i : number, message : StringReference) : boolean{
		var success : boolean;

		if(charIsNumber(n[i])){
			/* 0 first means only 0.*/
			if(n[i] == '0'){
				i = i + 1;
			}else{
				/* 1-9 first, read following digits.*/
				i = IsValidJSONNumberAdvancePastDigits(n, i);
			}

			if(i < n.length){
				success = IsValidJSONNumberFromDotOrExponent(n, i, message);
			}else{
				/* If integer, we are done now.*/
				success = true;
			}
		}else{
			success = false;
			message.stringx = "A number must start with 0-9 (after the optional sign).".split('');
		}

		return success;
	}


	function IsValidJSONNumberAdvancePastDigits(n : string [], i : number) : number{
		var done : boolean;

		i = i + 1;
		done = false;
		for(; i < n.length && !done; ){
			if(charIsNumber(n[i])){
				i = i + 1;
			}else{
				done = true;
			}
		}

		return i;
	}


	function IsValidJSONNumberFromDotOrExponent(n : string [], i : number, message : StringReference) : boolean{
		var wasDotAndOrE : boolean, success : boolean;

		wasDotAndOrE = false;
		success = true;

		if(n[i] == '.'){
			i = i + 1;
			wasDotAndOrE = true;

			if(i < n.length){
				if(charIsNumber(n[i])){
					/* Read digits following decimal point.*/
					i = IsValidJSONNumberAdvancePastDigits(n, i);

					if(i == n.length){
						/* If non-scientific decimal number, we are done.*/
						success = true;
					}
				}else{
					success = false;
					message.stringx = "There must be numbers after the decimal point.".split('');
				}
			}else{
				success = false;
				message.stringx = "There must be numbers after the decimal point.".split('');
			}
		}

		if(i < n.length && success){
			if(n[i] == 'e' || n[i] == 'E'){
				wasDotAndOrE = true;
				success = IsValidJSONNumberFromExponent(n, i, message);
			}else{
				success = false;
				message.stringx = "Expected e or E.".split('');
			}
		}else if(i == n.length && success){
			/* If number with decimal point.*/
			success = true;
		}else{
			success = false;
			message.stringx = "There must be numbers after the decimal point.".split('');
		}

		if(wasDotAndOrE){
		}else{
			success = false;
			message.stringx = "Exprected decimal point or e or E.".split('');
		}

		return success;
	}


	function IsValidJSONNumberFromExponent(n : string [], i : number, message : StringReference) : boolean{
		var success : boolean;

		i = i + 1;

		if(i < n.length){
			/* The exponent sign can either + or -,*/
			if(n[i] == '+' || n[i] == '-'){
				i = i + 1;
			}

			if(i < n.length){
				if(charIsNumber(n[i])){
					/* Read digits following decimal point.*/
					i = IsValidJSONNumberAdvancePastDigits(n, i);

					if(i == n.length){
						/* We found scientific number.*/
						success = true;
					}else{
						success = false;
						message.stringx = "There was characters following the exponent.".split('');
					}
				}else{
					success = false;
					message.stringx = "There must be a digit following the optional exponent sign.".split('');
				}
			}else{
				success = false;
				message.stringx = "There must be a digit following optional the exponent sign.".split('');
			}
		}else{
			success = false;
			message.stringx = "There must be a sign or a digit following e or E.".split('');
		}

		return success;
	}


	function IsJSONNumberCharacter(c : string) : boolean{
		var numericCharacters : string [];
		var found : boolean;
		var i : number;

		numericCharacters = "0123456789.-+eE".split('');

		found = false;

		for(i = 0; i < numericCharacters.length; i = i + 1){
			if(numericCharacters[i] == c){
				found = true;
			}
		}

		return found;
	}


	function GetJSONPrimitiveName(stringx : string [], start : number, message : StringReference, primitive : string [], tokenReference : StringReference) : boolean{
		var c : string, p : string;
		var done : boolean, success : boolean;
		var i : number;
		var str : string [], token : string [];

		done = false;
		success = true;

		token = "".split('');

		for(i = start; i < stringx.length && ((i - start) < primitive.length) && !done; i = i + 1){
			c = stringx[i];
			p = primitive[i - start];
			if(c == p){
				/* OK*/
				if((i + 1 - start) == primitive.length){
					done = true;
				}
			}else{
				str = "".split('');
				str = strConcatenateString(str, "Primitive invalid: ".split(''));
				str = strAppendCharacter(str, c);
				str = strAppendString(str, " vs ".split(''));
				str = strAppendCharacter(str, p);

				message.stringx = str;
				done = true;
				success = false;
			}
		}

		if(done){
			if(StringsEqual(primitive, "false".split(''))){
				token = "false".split('');
			}
			if(StringsEqual(primitive, "true".split(''))){
				token = "true".split('');
			}
			if(StringsEqual(primitive, "null".split(''))){
				token = "null".split('');
			}
		}else{
			message.stringx = "Primitive invalid".split('');
			success = false;
		}

		tokenReference.stringx = token;

		return success;
	}


	function GetJSONString(json : string [], start : number, tokenReference : StringReference, stringLengthReference : NumberReference, message : StringReference) : boolean{
		var success : boolean, done : boolean;
		var stringx : string [], hex : string [];
		var characterCount : NumberReference, hexReference : NumberReference;
		var i : number, l : number, c : number;
		var errorMessage : StringReference;

		characterCount = CreateNumberReference(0);
		hex = CreateString(4, '0');
		hexReference = new NumberReference();
		errorMessage = new StringReference();

		success = IsValidJSONStringInJSON(json, start, characterCount, stringLengthReference, message);

		if(success){
			l = characterCount.numberValue;
			stringx = new Array<string>(l);

			c = 0;
			stringx[c] = '\"';
			c = c + 1;

			done = false;
			for(i = start + 1; !done; i = i + 1){
				if(json[i] == '\\'){
					i = i + 1;
					if(json[i] == '\"' || json[i] == '\\' || json[i] == '/'){
						stringx[c] = json[i];
						c = c + 1;
					}else if(json[i] == 'b'){
						stringx[c] = String.fromCharCode(8);
						c = c + 1;
					}else if(json[i] == 'f'){
						stringx[c] = String.fromCharCode(12);
						c = c + 1;
					}else if(json[i] == 'n'){
						stringx[c] = String.fromCharCode(10);
						c = c + 1;
					}else if(json[i] == 'r'){
						stringx[c] = String.fromCharCode(13);
						c = c + 1;
					}else if(json[i] == 't'){
						stringx[c] = String.fromCharCode(9);
						c = c + 1;
					}else if(json[i] == 'u'){
						i = i + 1;
						hex[0] = charToUpperCase(json[i + 0]);
						hex[1] = charToUpperCase(json[i + 1]);
						hex[2] = charToUpperCase(json[i + 2]);
						hex[3] = charToUpperCase(json[i + 3]);
						nCreateNumberFromStringWithCheck(hex, 16, hexReference, errorMessage);
						stringx[c] = String.fromCharCode(hexReference.numberValue);
						i = i + 3;
						c = c + 1;
					}
				}else if(json[i] == '\"'){
					stringx[c] = json[i];
					c = c + 1;
					done = true;
				}else{
					stringx[c] = json[i];
					c = c + 1;
				}
			}

			tokenReference.stringx = stringx;
			success = true;
		}else{
			message.stringx = "End of string was not found.".split('');
			success = false;
		}

		return success;
	}


	function IsValidJSONString(jsonString : string [], message : StringReference) : boolean{
		var valid : boolean;
		var numberReference : NumberReference, stringLength : NumberReference;

		numberReference = new NumberReference();
		stringLength = new NumberReference();

		valid = IsValidJSONStringInJSON(jsonString, 0, numberReference, stringLength, message);

		return valid;
	}


	function IsValidJSONStringInJSON(json : string [], start : number, characterCount : NumberReference, stringLengthReference : NumberReference, message : StringReference) : boolean{
		var success : boolean, done : boolean;
		var i : number, j : number;
		var c : string;

		success = true;
		done = false;

		characterCount.numberValue = 1;

		for(i = start + 1; i < json.length && !done && success; i = i + 1){
			if(!IsJSONIllegalControllCharacter(json[i])){
				if(json[i] == '\\'){
					i = i + 1;
					if(i < json.length){
						if(json[i] == '\"' || json[i] == '\\' || json[i] == '/' || json[i] == 'b' || json[i] == 'f' || json[i] == 'n' || json[i] == 'r' || json[i] == 't'){
							characterCount.numberValue = characterCount.numberValue + 1;
						}else if(json[i] == 'u'){
							if(i + 4 < json.length){
								for(j = 0; j < 4 && success; j = j + 1){
									c = json[i + j + 1];
									if(nCharacterIsNumberCharacterInBase(c, 16) || c == 'a' || c == 'b' || c == 'c' || c == 'd' || c == 'e' || c == 'f'){
									}else{
										success = false;
										message.stringx = "\\u must be followed by four hexadecimal digits.".split('');
									}
								}
								characterCount.numberValue = characterCount.numberValue + 1;
								i = i + 4;
							}else{
								success = false;
								message.stringx = "\\u must be followed by four characters.".split('');
							}
						}else{
							success = false;
							message.stringx = "Escaped character invalid.".split('');
						}
					}else{
						success = false;
						message.stringx = "There must be at least two character after string escape.".split('');
					}
				}else if(json[i] == '\"'){
					characterCount.numberValue = characterCount.numberValue + 1;
					done = true;
				}else{
					characterCount.numberValue = characterCount.numberValue + 1;
				}
			}else{
				success = false;
				message.stringx = "Unicode code points 0-31 not allowed in JSON string.".split('');
			}
		}

		if(done){
			stringLengthReference.numberValue = i - start;
		}else{
			success = false;
			message.stringx = "String must end with \".".split('');
		}

		return success;
	}


	function IsJSONIllegalControllCharacter(c : string) : boolean{
		var cnr : number;
		var isControll : boolean;

		cnr = c.charCodeAt(0);

		if(cnr >= 0 && cnr < 32){
			isControll = true;
		}else{
			isControll = false;
		}

		return isControll;
	}


	function IsValidJSON(json : string [], message : StringReference) : boolean{
		var success : boolean;
		var elementReference : DataReference;

		elementReference = new DataReference();

		success = ReadJSON(json, elementReference, message);

		if(success){
			FreeData(elementReference.data);
		}

		return success;
	}


	function ComputeJSONStringLength(data : Data) : number{
		var result : number;

		result = 0;

		if(IsStructure(data)){
			result = result + ComputeJSONObjectStringLength(data);
		}else if(IsString(data)){
			result = JSONEscapedStringLength(data.stringx) + 2;
		}else if(IsArray(data)){
			result = result + ComputeJSONArrayStringLength(data);
		}else if(IsNumber(data)){
			result = result + ComputeJSONNumberStringLength(data);
		}else if(IsNoType(data)){
			result = result + "null".split('').length;
		}else if(IsBoolean(data)){
			result = result + ComputeJSONBooleanStringLength(data);
		}

		return result;
	}


	function ComputeJSONBooleanStringLength(data : Data) : number{
		var result : number;

		if(data.booleanxx){
			result = "true".split('').length;
		}else{
			result = "false".split('').length;
		}

		return result;
	}


	function ComputeJSONNumberStringLength(data : Data) : number{
		var length : number;
		var a : string [];

		if(data.numberx != 0){
			if(Math.abs(data.numberx) >= 10**15 || Math.abs(data.numberx) <= 10**(-15)){
				a = nCreateStringScientificNotationDecimalFromNumber(data.numberx);
				length = a.length;
			}else{
				a = nCreateStringDecimalFromNumber(data.numberx);
				length = a.length;
			}
		}else{
			length = 1;
		}

		return length;
	}


	function ComputeJSONArrayStringLength(data : Data) : number{
		var arrayElement : Data;
		var i : number;
		var length : number;

		length = 1;

		for(i = 0; i < data.array.length; i = i + 1){
			arrayElement = ArrayIndex(data.array, i);

			length = length + ComputeJSONStringLength(arrayElement);

			if(i + 1 != data.array.length){
				length = length + 1;
			}
		}

		length = length + 1;

		return length;
	}


	function ComputeJSONObjectStringLength(data : Data) : number{
		var key : string [];
		var i : number;
		var keys : StringReference [];
		var objectElement : Data;
		var length : number;

		length = 1;

		keys = GetStructKeys(data.structure);
		for(i = 0; i < keys.length; i = i + 1){
			key = keys[i].stringx;
			objectElement = GetDataFromStruct(data.structure, key);

			length = length + 1;
			length = length + JSONEscapedStringLength(key);
			length = length + 1;
			length = length + 1;

			length = length + ComputeJSONStringLength(objectElement);

			if(i + 1 != keys.length){
				length = length + 1;
			}
		}

		length = length + 1;

		return length;
	}


	function TestEscaper(failures : NumberReference) : void{
		var c : string;
		var letters : NumberReference;
		var mustBeEscaped : boolean;
		var escaped : string [];

		letters = CreateNumberReference(0);

		c = String.fromCharCode(9);
		mustBeEscaped = JSONMustBeEscaped(c, letters);
		AssertTrue(mustBeEscaped, failures);
		AssertEquals(letters.numberValue, 2, failures);

		escaped = JSONEscapeCharacter(c);
		AssertStringEquals(escaped, "\\t".split(''), failures);

		c = String.fromCharCode(0);
		mustBeEscaped = JSONMustBeEscaped(c, letters);
		AssertTrue(mustBeEscaped, failures);
		AssertEquals(letters.numberValue, 6, failures);

		escaped = JSONEscapeCharacter(c);
		AssertStringEquals(escaped, "\\u0000".split(''), failures);
	}


	function mapTo(root : Data) : Example{
		var example : Example;

		example = new Example();
		example.a = GetDataFromStruct(root.structure, "a".split('')).stringx;
		example.b = mapbTo(GetDataFromStruct(root.structure, "b".split('')).array);
		example.x = mapXTo(GetDataFromStruct(root.structure, "x".split('')).structure);

		return example;
	}


	function mapXTo(object : Structure) : X{
		var x : X;

		x = new X();

		if(IsNoType(GetDataFromStruct(object, "x1".split('')))){
			x.x1IsNull = true;
			x.x1 = "".split('');
		}

		x.x2 = GetDataFromStruct(object, "x2".split('')).booleanxx;
		x.x3 = GetDataFromStruct(object, "x3".split('')).booleanxx;

		return x;
	}


	function mapbTo(array : Arrayx) : number []{
		var b : number [];
		var i : number;

		b = new Array<number>(ArrayLength(array));

		for(i = 0; i < array.length; i = i + 1){
			b[i] = ArrayIndex(array, i).numberx;
		}

		return b;
	}


	function TestWriter(failures : NumberReference) : void{
		var stringx : string [];
		var root : Data, e : Data;
		var example : Example;
		var da : DynamicArrayCharacters;
		var settings : WriterSettings;

		root = CreateExampleJSON();

		stringx = WriteJSON(root);

		AssertEquals(stringx.length, 66, failures);

		/* Does not work with Java Maps..*/
		example = mapTo(root);

		AssertStringEquals("hei".split(''), example.a, failures);
		AssertTrue(example.x.x1IsNull, failures);
		AssertTrue(example.x.x2, failures);
		AssertFalse(example.x.x3, failures);
		AssertEquals(1.2, example.b[0], failures);
		AssertEquals(0.1, example.b[1], failures);
		AssertEquals(100, example.b[2], failures);

		FreeData(root);

		e = CreateNumberData(0);
		da = CreateDynamicArrayCharacters();

		settings = CreateDefaultWriterSettings();
		WriteNumber(e, da, settings);

		stringx = DynamicArrayCharactersToArray(da);
		AssertStringEquals("0".split(''), stringx, failures);
	}


	function CreateExampleJSON() : Data{
		var root : Data;
		var innerObject : Structure;
		var array : Arrayx;

		root = CreateNewStructData();

		innerObject = CreateStructure();

		AddDataToStruct(innerObject, "x1".split(''), CreateNoTypeData());
		AddBooleanToStruct(innerObject, "x2".split(''), true);
		AddBooleanToStruct(innerObject, "x3".split(''), false);

		array = CreateArray();
		AddNumberToArray(array, 1.2);
		AddNumberToArray(array, 0.1);
		AddNumberToArray(array, 100);

		AddStringToStruct(root.structure, "a".split(''), "hei".split(''));
		AddArrayToStruct(root.structure, "b".split(''), array);
		AddStructToStruct(root.structure, "x".split(''), innerObject);

		return root;
	}


	function TestWriterEscape(failures : NumberReference) : void{
		var stringx : string [];
		var root : Data;

		root = CreateStringData("\t\n".split(''));

		stringx = WriteJSON(root);

		AssertEquals(stringx.length, 6, failures);

		AssertStringEquals("\"\\t\\n\"".split(''), stringx, failures);

		FreeData(root);
	}


	function TestWriter2(failures : NumberReference) : void{
		var e : Data;
		var result : string [], json : string [];
		var obj : DataReference;
		var message : StringReference;
		var success : boolean;

		obj = new DataReference();
		message = new StringReference();
		json = "{\"test1\":0,\"Test2\":0,\"test3\":0}".split('');
		success = ReadJSON(json, obj, message);

		AssertTrue(success, failures);

		if(success){
			e = obj.data;

			result = WriteJSON(e);

			AssertStringEquals(result, json, failures);
		}
	}


	function TestWriter3(failures : NumberReference) : void{
		var e : Data;
		var result : string [];

		e = CreateNewStructData();
		AddStringToStruct(e.structure, "example.com/style.js".split(''), "console.log(\"hello world\")".split(''));

		result = WriteJSON(e);

		AssertStringEquals(result, "{\"example.com\\/style.js\":\"console.log(\\\"hello world\\\")\"}".split(''), failures);
	}


	function TestReader(failures : NumberReference) : void{
		var json : Data;
		var stringx : string [], string2 : string [];
		var message : StringReference;
		var elementReference : DataReference;
		var success : boolean;

		json = CreateExampleJSON();
		stringx = WriteJSON(json);
		elementReference = new DataReference();

		message = CreateStringReference("".split(''));

		success = ReadJSON(stringx, elementReference, message);
		AssertTrue(success, failures);

		if(success){
			json = elementReference.data;
			string2 = WriteJSON(json);

			AssertEquals(stringx.length, string2.length, failures);
		}
	}


	function Test2(failures : NumberReference) : void{
		var stringx : string [], string2 : string [];
		var message : StringReference;
		var json : Data;
		var elementReference : DataReference;
		var success : boolean;

		stringx = strConcatenateString("{".split(''), "\"name\":\"base64\",".split(''));
		stringx = strAppendString(stringx, "\"version\":\"0.1.0\",".split(''));
		stringx = strAppendString(stringx, "\"business namespace\":\"no.inductive.idea10.programs\",".split(''));
		stringx = strAppendString(stringx, "\"scientific namespace\":\"computerscience.algorithms.base64\",".split(''));
		stringx = strAppendString(stringx, "\"imports\":[".split(''));
		stringx = strAppendString(stringx, "],".split(''));
		stringx = strAppendString(stringx, "\"imports2\":{".split(''));
		stringx = strAppendString(stringx, "},".split(''));
		stringx = strAppendString(stringx, "\"development imports\":[".split(''));
		stringx = strAppendString(stringx, "[\"\",\"no.inductive.idea10.programs\",\"arrays\",\"0.1.0\"]".split(''));
		stringx = strAppendString(stringx, "]".split(''));
		stringx = strAppendString(stringx, "}".split(''));

		message = CreateStringReference("".split(''));
		elementReference = new DataReference();
		success = ReadJSON(stringx, elementReference, message);
		AssertTrue(success, failures);

		if(success){
			json = elementReference.data;

			string2 = WriteJSON(json);

			AssertEquals(stringx.length, string2.length, failures);
		}
	}


	function TestReaderExample(failures : NumberReference) : void{
		var json : string [];
		var message : StringReference;
		var elementReference : DataReference;
		var outputJSON : StringReference;

		message = CreateStringReference("".split(''));
		elementReference = new DataReference();
		outputJSON = CreateStringReference("".split(''));

		json = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');

		JSONExample(json, message, elementReference, outputJSON);
	}


	function JSONExample(json : string [], messages : StringReference, elementReference : DataReference, outputJSON : StringReference) : void{
		var success : boolean;
		var element : Data, aElement : Data;
		var stringx : string [];
		var array : Arrayx;
		var x : number, y : number, z : number;

		/* The following JSON is in the string json:
           {
             "a": "hi",
             "b": [1.2, 0.1, 100],
             "x": {
               "x1": null,
               "x2": true,
               "x3": false
             }
           }
        */

		/* This functions reads the JSON*/
		success = ReadJSON(json, elementReference, messages);

		/* The return value 'success' is set to true of the parsing succeeds,*/
		/* if not, errorMessages contains the reason.*/
		if(success){
			/* We can now extract the data structure:*/
			element = elementReference.data;

			/* The following is gets the value "hi" for key "a":*/
			aElement = GetDataFromStruct(element.structure, "a".split(''));
			stringx = aElement.stringx;

			/* The following is gets the array [1.2, 0.1, 100] for key "b":*/
			aElement = GetDataFromStruct(element.structure, "b".split(''));
			array = aElement.array;
			x = ArrayIndex(array, 0).numberx;
			y = ArrayIndex(array, 1).numberx;
			z = ArrayIndex(array, 2).numberx;

			/* This is how you write JSON:*/
			outputJSON.stringx = WriteJSON(element);
		}else{
			/* There was a problem, so we cannot read our data structure.*/
			/* Instead, we can check out the error message.*/
			stringx = messages.stringx;
		}
	}


	function TestReader2(failures : NumberReference) : void{
		var json : Data;
		var stringx : string [], string2 : string [];
		var message : StringReference;
		var dataRef : DataReference;
		var success : boolean;

		stringx = "{\"success\":true,\"message\":\"Backups null\",\"data\":[{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T12-52-31\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T12-52-31\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T12-52-31\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T12-52-31\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T12-52-31\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]},{\"Date + Time\":\"2024-06-20T11-29-17\",\"Vdisks\":[\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-21T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"disk1-2024-06-20T12-52-31.img\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-2024-06-20T11-29-17.service\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-disk1-2024-06-20T11-29-17.img\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\",\"vm1-2024-06-20T11-29-17.json\"]}]}".split('');
		dataRef = new DataReference();

		message = CreateStringReference("".split(''));

		success = ReadJSON(stringx, dataRef, message);
		AssertTrue(success, failures);

		if(success){
			string2 = WriteJSON(dataRef.data);

			AssertStringEquals(stringx, string2, failures);
		}
	}


	function test() : number{
		var failures : NumberReference;

		failures = CreateNumberReference(0);

		TestReader(failures);
		TestReader2(failures);
		Test2(failures);
		TestWriter(failures);
		TestWriterEscape(failures);
		TestTokenizer1(failures);
		TestReaderExample(failures);
		TestEscaper(failures);
		TestValidator(failures);
		TestComparator(failures);
		TestWriter2(failures);
		TestWriter3(failures);

		return failures.numberValue;
	}


	function TestValidator(failures : NumberReference) : void{
		var a : string [], b : string [], c : string [], d : string [];
		var message : StringReference;

		message = CreateStringReference("".split(''));

		a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
		b = "{{}}]".split('');
		c = "".split('');
		d = "{".split('');

		AssertTrue(IsValidJSON(a, message), failures);
		AssertFalse(IsValidJSON(b, message), failures);
		AssertFalse(IsValidJSON(c, message), failures);
		AssertFalse(IsValidJSON(d, message), failures);
	}


	function TestComparator(failures : NumberReference) : void{
		var a : string [], b : string [];
		var message : StringReference;
		var equalsReference : BooleanReference;
		var success : boolean;

		message = CreateStringReference("".split(''));
		equalsReference = CreateBooleanReference(false);

		a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
		b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

		success = JSONCompare(a, b, 0.0001, equalsReference, message);

		AssertTrue(success, failures);
		AssertTrue(equalsReference.booleanValue, failures);

		a = "{\"a\":\"hi\",\"b\":[1.201, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
		b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

		success = JSONCompare(a, b, 0.0001, equalsReference, message);

		AssertTrue(success, failures);
		AssertFalse(equalsReference.booleanValue, failures);

		success = JSONCompare(a, b, 0.1, equalsReference, message);

		AssertTrue(success, failures);
		AssertTrue(equalsReference.booleanValue, failures);
	}


	function TestTokenizer1(failures : NumberReference) : void{
		var countReference : NumberReference, stringLength : NumberReference;
		var tokenArrayReference : StringArrayReference;
		var message : StringReference;
		var success : boolean;
		var numbers : StringReference [];
		var i : number;

		countReference = CreateNumberReference(0);
		stringLength = CreateNumberReference(0);
		message = CreateStringReference("".split(''));

		tokenArrayReference = new StringArrayReference();

		success = JSONTokenize("false".split(''), tokenArrayReference, message);
		AssertTrue(success, failures);
		if(success){
			AssertEquals(tokenArrayReference.stringArray.length, 2, failures);
			AssertStringEquals(tokenArrayReference.stringArray[0].stringx, "false".split(''), failures);
		}

		numbers = strSplitByString("11, -1e-1, -0.123456789e-99, 1E1, -0.1E23".split(''), ", ".split(''));

		for(i = 0; i < numbers.length; i = i + 1){
			success = JSONTokenize(numbers[i].stringx, tokenArrayReference, message);
			AssertTrue(success, failures);
			if(success){
				AssertEquals(tokenArrayReference.stringArray.length, 2, failures);
				AssertStringEquals(tokenArrayReference.stringArray[0].stringx, numbers[i].stringx, failures);
			}
		}

		success = IsValidJSONStringInJSON("\"\"".split(''), 0, countReference, stringLength, message);
		AssertTrue(success, failures);
		if(success){
			AssertEquals(countReference.numberValue, 2, failures);
		}

		success = IsValidJSONString("\"\\u1234\\n\\r\\f\\b\\t\"".split(''), message);
		AssertTrue(success, failures);

		success = JSONTokenize("\"".split(''), tokenArrayReference, message);
		AssertFalse(success, failures);

		success = IsValidJSONNumber("1.1-e1".split(''), message);
		AssertFalse(success, failures);

		success = IsValidJSONNumber("1E+2".split(''), message);
		AssertTrue(success, failures);

		success = IsValidJSONString("\"\\uAAAG\"".split(''), message);
		AssertFalse(success, failures);

		success = IsValidJSONNumber("0".split(''), message);
		AssertTrue(success, failures);

		success = IsValidJSONNumber("0e0".split(''), message);
		AssertTrue(success, failures);

		success = IsValidJSONNumber("00".split(''), message);
		AssertFalse(success, failures);
	}


	function CreateBooleanReference(value : boolean) : BooleanReference{
		var ref : BooleanReference;

		ref = new BooleanReference();
		ref.booleanValue = value;

		return ref;
	}


	function CreateBooleanArrayReference(value : boolean []) : BooleanArrayReference{
		var ref : BooleanArrayReference;

		ref = new BooleanArrayReference();
		ref.booleanArray = value;

		return ref;
	}


	function CreateBooleanArrayReferenceLengthValue(length : number, value : boolean) : BooleanArrayReference{
		var ref : BooleanArrayReference;
		var i : number;

		ref = new BooleanArrayReference();
		ref.booleanArray = new Array<boolean>(length);

		for(i = 0; i < length; i = i + 1){
			ref.booleanArray[i] = value;
		}

		return ref;
	}


	function FreeBooleanArrayReference(booleanArrayReference : BooleanArrayReference) : void{
		delete booleanArrayReference.booleanArray;
		booleanArrayReference = undefined;
	}


	function CreateCharacterReference(value : string) : CharacterReference{
		var ref : CharacterReference;

		ref = new CharacterReference();
		ref.characterValue = value;

		return ref;
	}


	function CreateNumberReference(value : number) : NumberReference{
		var ref : NumberReference;

		ref = new NumberReference();
		ref.numberValue = value;

		return ref;
	}


	function CreateNumberArrayReference(value : number []) : NumberArrayReference{
		var ref : NumberArrayReference;

		ref = new NumberArrayReference();
		ref.numberArray = value;

		return ref;
	}


	function CreateNumberArrayReferenceLengthValue(length : number, value : number) : NumberArrayReference{
		var ref : NumberArrayReference;
		var i : number;

		ref = new NumberArrayReference();
		ref.numberArray = new Array<number>(length);

		for(i = 0; i < length; i = i + 1){
			ref.numberArray[i] = value;
		}

		return ref;
	}


	function FreeNumberArrayReference(numberArrayReference : NumberArrayReference) : void{
		delete numberArrayReference.numberArray;
		numberArrayReference = undefined;
	}


	function CreateStringReference(value : string []) : StringReference{
		var ref : StringReference;

		ref = new StringReference();
		ref.stringx = value;

		return ref;
	}


	function CreateStringReferenceLengthValue(length : number, value : string) : StringReference{
		var ref : StringReference;
		var i : number;

		ref = new StringReference();
		ref.stringx = new Array<string>(length);

		for(i = 0; i < length; i = i + 1){
			ref.stringx[i] = value;
		}

		return ref;
	}


	function FreeStringReference(stringReference : StringReference) : void{
		delete stringReference.stringx;
		stringReference = undefined;
	}


	function CreateStringArrayReference(strings : StringReference []) : StringArrayReference{
		var ref : StringArrayReference;

		ref = new StringArrayReference();
		ref.stringArray = strings;

		return ref;
	}


	function CreateStringArrayReferenceLengthValue(length : number, value : string []) : StringArrayReference{
		var ref : StringArrayReference;
		var i : number;

		ref = new StringArrayReference();
		ref.stringArray = new Array<StringReference>(length);

		for(i = 0; i < length; i = i + 1){
			ref.stringArray[i] = CreateStringReference(value);
		}

		return ref;
	}


	function FreeStringArrayReference(stringArrayReference : StringArrayReference) : void{
		var i : number;

		for(i = 0; i < stringArrayReference.stringArray.length; i = i + 1){
			delete stringArrayReference.stringArray[i];
		}
		delete stringArrayReference.stringArray;
		stringArrayReference = undefined;
	}


	function strWriteStringToStingStream(stream : string [], index : NumberReference, src : string []) : void{
		var i : number;

		for(i = 0; i < src.length; i = i + 1){
			stream[index.numberValue + i] = src[i];
		}
		index.numberValue = index.numberValue + src.length;
	}


	function strWriteCharacterToStingStream(stream : string [], index : NumberReference, src : string) : void{
		stream[index.numberValue] = src;
		index.numberValue = index.numberValue + 1;
	}


	function strWriteBooleanToStingStream(stream : string [], index : NumberReference, src : boolean) : void{
		if(src){
			strWriteStringToStingStream(stream, index, "true".split(''));
		}else{
			strWriteStringToStingStream(stream, index, "false".split(''));
		}
	}


	function strSubstringWithCheck(stringx : string [], fromx : number, to : number, stringReference : StringReference) : boolean{
		var success : boolean;

		if(fromx >= 0 && fromx <= stringx.length && to >= 0 && to <= stringx.length && fromx <= to){
			stringReference.stringx = strSubstring(stringx, fromx, to);
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function strSubstring(stringx : string [], fromx : number, to : number) : string []{
		var n : string [];
		var i : number, length : number;

		length = to - fromx;

		n = new Array<string>(length);

		for(i = fromx; i < to; i = i + 1){
			n[i - fromx] = stringx[i];
		}

		return n;
	}


	function strAppendString(s1 : string [], s2 : string []) : string []{
		var newString : string [];

		newString = strConcatenateString(s1, s2);

		s1 = undefined;

		return newString;
	}


	function strConcatenateString(s1 : string [], s2 : string []) : string []{
		var newString : string [];
		var i : number;

		newString = new Array<string>(s1.length + s2.length);

		for(i = 0; i < s1.length; i = i + 1){
			newString[i] = s1[i];
		}

		for(i = 0; i < s2.length; i = i + 1){
			newString[s1.length + i] = s2[i];
		}

		return newString;
	}


	function strAppendCharacter(stringx : string [], c : string) : string []{
		var newString : string [];

		newString = strConcatenateCharacter(stringx, c);

		stringx = undefined;

		return newString;
	}


	function strConcatenateCharacter(stringx : string [], c : string) : string []{
		var newString : string [];
		var i : number;
		newString = new Array<string>(stringx.length + 1);

		for(i = 0; i < stringx.length; i = i + 1){
			newString[i] = stringx[i];
		}

		newString[stringx.length] = c;

		return newString;
	}


	function strSplitByCharacter(toSplit : string [], splitBy : string) : StringReference []{
		var parts : StringReference [];
		var i : number;
		var c : string;
		var ll : LinkedListStrings;
		var next : LinkedListCharacters;
		var part : string [];

		ll = CreateLinkedListString();

		next = CreateLinkedListCharacter();
		for(i = 0; i < toSplit.length; i = i + 1){
			c = toSplit[i];

			if(c == splitBy){
				part = LinkedListCharactersToArray(next);
				LinkedListAddString(ll, part);
				FreeLinkedListCharacter(next);
				next = CreateLinkedListCharacter();
			}else{
				LinkedListAddCharacter(next, c);
			}
		}

		part = LinkedListCharactersToArray(next);
		LinkedListAddString(ll, part);
		FreeLinkedListCharacter(next);

		parts = LinkedListStringsToArray(ll);
		FreeLinkedListString(ll);

		return parts;
	}


	function strIndexOfCharacter(stringx : string [], character : string, indexReference : NumberReference) : boolean{
		var i : number;
		var found : boolean;

		found = false;
		for(i = 0; i < stringx.length && !found; i = i + 1){
			if(stringx[i] == character){
				found = true;
				indexReference.numberValue = i;
			}
		}

		return found;
	}


	function strLastIndexOfCharacter(stringx : string [], character : string, indexReference : NumberReference) : boolean{
		var i : number;
		var found : boolean;

		found = false;
		for(i = 0; i < stringx.length; i = i + 1){
			if(stringx[i] == character){
				found = true;
				indexReference.numberValue = i;
			}
		}

		return found;
	}


	function strSubstringEqualsWithCheck(stringx : string [], fromx : number, substring : string [], equalsReference : BooleanReference) : boolean{
		var success : boolean;

		if(fromx < stringx.length){
			success = true;
			equalsReference.booleanValue = strSubstringEquals(stringx, fromx, substring);
		}else{
			success = false;
		}

		return success;
	}


	function strSubstringEquals(stringx : string [], fromx : number, substring : string []) : boolean{
		var i : number;
		var equal : boolean;

		equal = true;
		if(stringx.length - fromx >= substring.length){
			for(i = 0; i < substring.length && equal; i = i + 1){
				if(stringx[fromx + i] != substring[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function strIndexOfString(stringx : string [], substring : string [], indexReference : NumberReference) : boolean{
		var i : number;
		var found : boolean;

		found = false;
		for(i = 0; i < stringx.length - substring.length + 1 && !found; i = i + 1){
			if(strSubstringEquals(stringx, i, substring)){
				found = true;
				indexReference.numberValue = i;
			}
		}

		return found;
	}


	function strContainsCharacter(stringx : string [], character : string) : boolean{
		var i : number;
		var found : boolean;

		found = false;
		for(i = 0; i < stringx.length && !found; i = i + 1){
			if(stringx[i] == character){
				found = true;
			}
		}

		return found;
	}


	function strContainsString(stringx : string [], substring : string []) : boolean{
		return strIndexOfString(stringx, substring, new NumberReference());
	}


	function strToUpperCase(stringx : string []) : void{
		var i : number;

		for(i = 0; i < stringx.length; i = i + 1){
			stringx[i] = charToUpperCase(stringx[i]);
		}
	}


	function strToLowerCase(stringx : string []) : void{
		var i : number;

		for(i = 0; i < stringx.length; i = i + 1){
			stringx[i] = charToLowerCase(stringx[i]);
		}
	}


	function strEqualsIgnoreCase(a : string [], b : string []) : boolean{
		var equal : boolean;
		var i : number;

		if(a.length == b.length){
			equal = true;
			for(i = 0; i < a.length && equal; i = i + 1){
				if(charToLowerCase(a[i]) != charToLowerCase(b[i])){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function strReplaceString(stringx : string [], toReplace : string [], replaceWith : string []) : string []{
		var result : string [];
		var i : number, j : number;
		var equalsReference : BooleanReference;
		var success : boolean;
		var da : DynamicArrayCharacters;

		da = CreateDynamicArrayCharacters();

		equalsReference = new BooleanReference();

		for(i = 0; i < stringx.length; ){
			success = strSubstringEqualsWithCheck(stringx, i, toReplace, equalsReference);
			if(success){
				success = equalsReference.booleanValue;
			}

			if(success && toReplace.length > 0){
				for(j = 0; j < replaceWith.length; j = j + 1){
					DynamicArrayAddCharacter(da, replaceWith[j]);
				}
				i = i + toReplace.length;
			}else{
				DynamicArrayAddCharacter(da, stringx[i]);
				i = i + 1;
			}
		}

		result = DynamicArrayCharactersToArray(da);

		FreeDynamicArrayCharacters(da);

		return result;
	}


	function strReplaceCharacterToNew(stringx : string [], toReplace : string, replaceWith : string) : string []{
		var result : string [];
		var i : number;

		result = new Array<string>(stringx.length);

		for(i = 0; i < stringx.length; i = i + 1){
			if(stringx[i] == toReplace){
				result[i] = replaceWith;
			}else{
				result[i] = stringx[i];
			}
		}

		return result;
	}


	function strReplaceCharacter(stringx : string [], toReplace : string, replaceWith : string) : void{
		var i : number;

		for(i = 0; i < stringx.length; i = i + 1){
			if(stringx[i] == toReplace){
				stringx[i] = replaceWith;
			}
		}
	}


	function strTrim(stringx : string []) : string []{
		var result : string [];
		var i : number, lastWhitespaceLocationStart : number, lastWhitespaceLocationEnd : number;
		var firstNonWhitespaceFound : boolean;

		/* Find whitepaces at the start.*/
		lastWhitespaceLocationStart = -1;
		firstNonWhitespaceFound = false;
		for(i = 0; i < stringx.length && !firstNonWhitespaceFound; i = i + 1){
			if(charIsWhiteSpace(stringx[i])){
				lastWhitespaceLocationStart = i;
			}else{
				firstNonWhitespaceFound = true;
			}
		}

		/* Find whitepaces at the end.*/
		lastWhitespaceLocationEnd = stringx.length;
		firstNonWhitespaceFound = false;
		for(i = stringx.length - 1; i >= 0 && !firstNonWhitespaceFound; i = i - 1){
			if(charIsWhiteSpace(stringx[i])){
				lastWhitespaceLocationEnd = i;
			}else{
				firstNonWhitespaceFound = true;
			}
		}

		if(lastWhitespaceLocationStart < lastWhitespaceLocationEnd){
			result = strSubstring(stringx, lastWhitespaceLocationStart + 1, lastWhitespaceLocationEnd);
		}else{
			result = new Array<string>(0);
		}

		return result;
	}


	function strStartsWith(stringx : string [], start : string []) : boolean{
		var startsWithString : boolean;

		startsWithString = false;
		if(stringx.length >= start.length){
			startsWithString = strSubstringEquals(stringx, 0, start);
		}

		return startsWithString;
	}


	function strEndsWith(stringx : string [], end : string []) : boolean{
		var endsWithString : boolean;

		endsWithString = false;
		if(stringx.length >= end.length){
			endsWithString = strSubstringEquals(stringx, stringx.length - end.length, end);
		}

		return endsWithString;
	}


	function strSplitByString(toSplit : string [], splitBy : string []) : StringReference []{
		var parts : StringReference [];
		var i : number;
		var c : string;
		var ll : LinkedListStrings;
		var next : LinkedListCharacters;
		var part : string [];

		ll = CreateLinkedListString();

		next = CreateLinkedListCharacter();
		for(i = 0; i < toSplit.length; ){
			c = toSplit[i];

			if(strSubstringEquals(toSplit, i, splitBy)){
				part = LinkedListCharactersToArray(next);
				LinkedListAddString(ll, part);
				FreeLinkedListCharacter(next);
				next = CreateLinkedListCharacter();
				i = i + splitBy.length;
			}else{
				LinkedListAddCharacter(next, c);
				i = i + 1;
			}
		}

		part = LinkedListCharactersToArray(next);
		LinkedListAddString(ll, part);
		FreeLinkedListCharacter(next);

		parts = LinkedListStringsToArray(ll);
		FreeLinkedListString(ll);

		return parts;
	}


	function strStringIsBefore(a : string [], b : string []) : boolean{
		var before : boolean, equal : boolean, done : boolean;
		var i : number;

		before = false;
		equal = true;
		done = false;

		if(a.length == 0 && b.length > 0){
			before = true;
		}else{
			for(i = 0; i < a.length && i < b.length && !done; i = i + 1){
				if(a[i] != b[i]){
					equal = false;
				}
				if(charCharacterIsBefore(a[i], b[i])){
					before = true;
				}
				if(charCharacterIsBefore(b[i], a[i])){
					done = true;
				}
			}

			if(equal){
				if(a.length < b.length){
					before = true;
				}
			}
		}

		return before;
	}


	function strJoinStringsWithSeparator(strings : StringReference [], separator : string []) : string []{
		var result : string [], stringx : string [];
		var length : number, i : number;
		var index : NumberReference;

		index = CreateNumberReference(0);

		length = 0;
		for(i = 0; i < strings.length; i = i + 1){
			length = length + strings[i].stringx.length;
		}
		length = length + (strings.length - 1)*separator.length;

		result = new Array<string>(length);

		for(i = 0; i < strings.length; i = i + 1){
			stringx = strings[i].stringx;
			strWriteStringToStingStream(result, index, stringx);
			if(i + 1 < strings.length){
				strWriteStringToStingStream(result, index, separator);
			}
		}

		index = undefined;

		return result;
	}


	function strJoinStrings(strings : StringReference []) : string []{
		var result : string [], stringx : string [];
		var length : number, i : number;
		var index : NumberReference;

		index = CreateNumberReference(0);

		length = 0;
		for(i = 0; i < strings.length; i = i + 1){
			length = length + strings[i].stringx.length;
		}

		result = new Array<string>(length);

		for(i = 0; i < strings.length; i = i + 1){
			stringx = strings[i].stringx;
			strWriteStringToStingStream(result, index, stringx);
		}

		index = undefined;

		return result;
	}


	function strStringOrder(a : string [], b : string []) : number{
		var order : number, minimum : number, i : number, ac : number, bc : number;
		var done : boolean;

		minimum = Math.min(a.length, b.length);

		done = false;
		order = 0;
		for(i = 0; i < minimum && !done; i = i + 1){
			ac = a[i].charCodeAt(0);
			bc = b[i].charCodeAt(0);

			if(ac < bc){
				done = true;
				order = 1;
			}else if(ac > bc){
				done = true;
				order = -1;
			}
		}

		if(!done){
			if(a.length < b.length){
				order = 1;
			}else if(a.length > b.length){
				order = -1;
			}
		}

		return order;
	}


	function strLeftPad(str : string [], width : number) : string []{
		var i : number;
		var padded : string [];

		padded = new Array<string>(width);
		FillString(padded, ' ');

		for(i = 0; i < str.length; i = i + 1){
			padded[width - str.length + i] = str[i];
		}

		return padded;
	}


	function strRightPad(str : string [], width : number) : string []{
		var i : number;
		var padded : string [];

		padded = new Array<string>(width);
		FillString(padded, ' ');

		for(i = 0; i < str.length; i = i + 1){
			padded[i] = str[i];
		}

		return padded;
	}


	function nCreateStringScientificNotationDecimalFromNumber(n : number) : string []{
		var mantissaReference : StringReference, exponentReference : StringReference;
		var e : number;
		var isPositive : boolean;
		var result : string [];

		mantissaReference = new StringReference();
		exponentReference = new StringReference();
		result = new Array<string>(0);

		if(n < 0){
			isPositive = false;
			n = -n;
		}else{
			isPositive = true;
		}

		if(n == 0){
			e = 0;
		}else{
			e = nGetFirstDecimalDigitPosition(n);

			if(e < 0){
				n = n*10**Math.abs(e);
			}else{
				n = n/10**e;
			}
		}

		mantissaReference.stringx = nCreateStringDecimalFromNumber(n);
		exponentReference.stringx = nCreateStringDecimalFromNumber(e);

		if(!isPositive){
			result = strAppendString(result, "-".split(''));
		}

		result = strAppendString(result, mantissaReference.stringx);
		result = strAppendString(result, "e".split(''));
		result = strAppendString(result, exponentReference.stringx);

		return result;
	}


	function nCreateStringDecimalFromNumber(numberx : number) : string []{
		var stringx : DynamicArrayCharacters;
		var maximumDigits : number, i : number, d : number, digitPosition : number, trailingZeros : number;
		var hasPrintedPoint : boolean, isPositive : boolean, done : boolean;
		var characterReference : CharacterReference;
		var c : string;
		var str : string [];

		stringx = CreateDynamicArrayCharacters();
		isPositive = true;

		if(numberx < 0){
			isPositive = false;
			numberx = -numberx;
		}

		if(numberx == 0){
			DynamicArrayAddCharacter(stringx, '0');
		}else{
			characterReference = new CharacterReference();

			maximumDigits = nGetMaximumDigitsForDecimal();

			digitPosition = nGetFirstDecimalDigitPosition(numberx);

			hasPrintedPoint = false;

			if(!isPositive){
				DynamicArrayAddCharacter(stringx, '-');
			}

			/* Print leading zeros.*/
			if(digitPosition < 0){
				DynamicArrayAddCharacter(stringx, '0');
				DynamicArrayAddCharacter(stringx, '.');
				hasPrintedPoint = true;
				for(i = 0; i < -digitPosition - 1; i = i + 1){
					DynamicArrayAddCharacter(stringx, '0');
				}
			}

			/* Count trailing zeros*/
			trailingZeros = 0;
			done = false;
			for(i = 0; i < maximumDigits && !done; i = i + 1){
				d = nGetDecimalDigitWithFirstDigitPosition(numberx, digitPosition, maximumDigits - i - 1);
				if(d == 0){
					trailingZeros = trailingZeros + 1;
				}else{
					done = true;
				}
			}

			/* Print number.*/
			for(i = 0; i < maximumDigits; i = i + 1){
				d = nGetDecimalDigitWithFirstDigitPosition(numberx, digitPosition, i);

				if(!hasPrintedPoint && digitPosition - i + 1 == 0){
					if(maximumDigits - i > trailingZeros){
						DynamicArrayAddCharacter(stringx, '.');
					}
					hasPrintedPoint = true;
				}

				if(maximumDigits - i <= trailingZeros && hasPrintedPoint){
				}else{
					nGetDecimalDigitCharacterFromNumberWithCheck(d, characterReference);
					c = characterReference.characterValue;
					DynamicArrayAddCharacter(stringx, c);
				}
			}

			/* Print trailing zeros.*/
			for(i = 0; i < digitPosition - maximumDigits + 1; i = i + 1){
				DynamicArrayAddCharacter(stringx, '0');
			}
		}

		/* Done*/
		str = DynamicArrayCharactersToArray(stringx);
		FreeDynamicArrayCharacters(stringx);
		return str;
	}


	function nCreateStringFromNumberWithCheck(numberx : number, base : number, stringRef : StringReference) : boolean{
		var stringx : DynamicArrayCharacters;
		var maximumDigits : number, i : number, d : number, digitPosition : number, trailingZeros : number;
		var success : boolean, hasPrintedPoint : boolean, isPositive : boolean, done : boolean;
		var characterReference : CharacterReference;
		var c : string;

		stringx = CreateDynamicArrayCharacters();
		isPositive = true;

		if(numberx < 0){
			isPositive = false;
			numberx = -numberx;
		}

		if(numberx == 0){
			DynamicArrayAddCharacter(stringx, '0');
			success = true;
		}else{
			characterReference = new CharacterReference();

			if(IsInteger(base)){
				success = true;

				maximumDigits = nGetMaximumDigitsForBase(base);

				digitPosition = nGetFirstDigitPosition(numberx, base);

				hasPrintedPoint = false;

				if(!isPositive){
					DynamicArrayAddCharacter(stringx, '-');
				}

				/* Print leading zeros.*/
				if(digitPosition < 0){
					DynamicArrayAddCharacter(stringx, '0');
					DynamicArrayAddCharacter(stringx, '.');
					hasPrintedPoint = true;
					for(i = 0; i < -digitPosition - 1; i = i + 1){
						DynamicArrayAddCharacter(stringx, '0');
					}
				}

				/* Count trailing zeros*/
				trailingZeros = 0;
				done = false;
				for(i = 0; i < maximumDigits && !done; i = i + 1){
					d = nGetDigit(numberx, base, maximumDigits - i - 1);
					if(d == 0){
						trailingZeros = trailingZeros + 1;
					}else{
						done = true;
					}
				}

				/* Print number.*/
				for(i = 0; i < maximumDigits && success; i = i + 1){
					d = nGetDigit(numberx, base, i);

					if(d >= base){
						d = base - 1;
					}

					if(!hasPrintedPoint && digitPosition - i + 1 == 0){
						if(maximumDigits - i > trailingZeros){
							DynamicArrayAddCharacter(stringx, '.');
						}
						hasPrintedPoint = true;
					}

					if(maximumDigits - i <= trailingZeros && hasPrintedPoint){
					}else{
						success = nGetSingleDigitCharacterFromNumberWithCheck(d, base, characterReference);
						if(success){
							c = characterReference.characterValue;
							DynamicArrayAddCharacter(stringx, c);
						}
					}
				}

				if(success){
					/* Print trailing zeros.*/
					for(i = 0; i < digitPosition - maximumDigits + 1; i = i + 1){
						DynamicArrayAddCharacter(stringx, '0');
					}
				}
			}else{
				success = false;
			}
		}

		if(success){
			stringRef.stringx = DynamicArrayCharactersToArray(stringx);
			FreeDynamicArrayCharacters(stringx);
		}

		/* Done*/
		return success;
	}


	function nGetMaximumDigitsForBase(base : number) : number{
		var t : number;

		t = 10**15;
		return Math.floor(Math.log10(t)/Math.log10(base));
	}


	function nGetMaximumDigitsForDecimal() : number{
		return 15;
	}


	function nGetFirstDecimalDigitPosition(n : number) : number{
		var power : number, m : number, i : number;
		var multiply : boolean, done : boolean;

		n = Math.abs(n);

		if(n != 0){
			if(Math.floor(n) < 10**15){
				multiply = true;
			}else{
				multiply = false;
			}

			done = false;
			m = 0;
			for(i = 0; !done; i = i + 1){
				if(multiply){
					m = n*10**i;
					if(Math.floor(m) >= 10**14){
						done = true;
					}
				}else{
					m = n/10**i;
					if(Math.floor(m) < 10**15){
						done = true;
					}
				}
			}

			if(multiply){
				power = 15 - i;
			}else{
				power = 15 + i - 2;
			}

			if(Round(m) >= 10**15){
				power = power + 1;
			}
		}else{
			power = 1;
		}

		return power;
	}


	function nGetFirstDigitPosition(n : number, base : number) : number{
		var power : number, m : number, i : number, maximumDigits : number;
		var multiply : boolean, done : boolean;

		maximumDigits = nGetMaximumDigitsForBase(base);
		n = Math.abs(n);

		if(n != 0){
			if(Math.floor(n) < base**maximumDigits){
				multiply = true;
			}else{
				multiply = false;
			}

			done = false;
			m = 0;
			for(i = 0; !done; i = i + 1){
				if(multiply){
					m = n*base**i;
					if(Math.floor(m) >= base**(maximumDigits - 1)){
						done = true;
					}
				}else{
					m = n/base**i;
					if(Math.floor(m) < base**maximumDigits){
						done = true;
					}
				}
			}

			if(multiply){
				power = maximumDigits - i;
			}else{
				power = maximumDigits + i - 2;
			}

			if(Round(m) >= base**maximumDigits){
				power = power + 1;
			}
		}else{
			power = 1;
		}

		return power;
	}


	function nGetSingleDigitCharacterFromNumberWithCheck(c : number, base : number, characterReference : CharacterReference) : boolean{
		var numberTable : string [];
		var success : boolean;

		numberTable = nGetDigitCharacterTable();

		if(c < base || c < numberTable.length){
			success = true;
			characterReference.characterValue = numberTable[c];
		}else{
			success = false;
		}

		return success;
	}


	function nGetDecimalDigitCharacterFromNumberWithCheck(c : number, characterRef : CharacterReference) : boolean{
		var numberTable : string [];
		var success : boolean;

		numberTable = "0123456789".split('');

		if(c >= 0 && c < 10){
			success = true;
			characterRef.characterValue = numberTable[c];
		}else{
			success = false;
		}

		return success;
	}


	function nGetDigitCharacterTable() : string []{
		var numberTable : string [];

		numberTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

		return numberTable;
	}


	function nGetDecimalDigit(n : number, index : number) : number{
		var digitPosition : number;

		digitPosition = nGetFirstDecimalDigitPosition(n);

		return nGetDecimalDigitWithFirstDigitPosition(n, digitPosition, index);
	}


	function nGetDecimalDigitWithFirstDigitPosition(n : number, digitPosition : number, index : number) : number{
		var d : number, e : number, m : number, i : number;

		n = Math.abs(n);

		e = 15 - digitPosition - 1;
		if(e < 0){
			n = Math.round(n/10**Math.abs(e));
		}else{
			n = Math.round(n*10**e);
		}

		m = n;
		d = 0;
		for(i = 0; i < 15 - index; i = i + 1){
			d = Math.round(m%10);
			m = m - d;
			m = Math.round(m/10);
		}

		return d;
	}


	function nGetDigit(n : number, base : number, index : number) : number{
		var d : number, digitPosition : number, e : number, m : number, maximumDigits : number, i : number;

		n = Math.abs(n);
		maximumDigits = nGetMaximumDigitsForBase(base);
		digitPosition = nGetFirstDigitPosition(n, base);

		e = maximumDigits - digitPosition - 1;
		if(e < 0){
			n = Math.round(n/base**Math.abs(e));
		}else{
			n = Math.round(n*base**e);
		}

		m = n;
		d = 0;
		for(i = 0; i < maximumDigits - index; i = i + 1){
			d = Math.round(m%base);
			m = m - d;
			m = Math.round(m/base);
		}

		return d;
	}


	function nNumberToHumanReadableShortScale(n : number) : string []{
		var res : string [], suffix : string [];
		var hasSuffix : boolean;
		var k : number, M : number, B : number, T : number, Q : number;

		k = 1000;
		M = k*1000;
		B = M*1000;
		T = B*1000;
		Q = T*1000;
		suffix = " ".split('');

		if(n < k){
			hasSuffix = false;
		}else{
			hasSuffix = true;
		}

		if(n >= k && n < M){
			if(n < 10*k){
				n = Round(n/100);
				n = n/10;
			}else{
				n = Round(n/k);
			}
			suffix = "k".split('');
		}else if(n >= M && n < B){
			if(n < 10*M){
				n = Round(n/(k*100));
				n = n/10;
			}else{
				n = Round(n/M);
			}
			suffix = "M".split('');
		}else if(n >= B && n < T){
			if(n < 10*B){
				n = Round(n/(M*100));
				n = n/10;
			}else{
				n = Round(n/B);
			}
			suffix = "B".split('');
		}else if(n >= T && n < Q){
			if(n < 10*T){
				n = Round(n/(B*100));
				n = n/10;
			}else{
				n = Round(n/T);
			}
			suffix = "T".split('');
		}else if(n >= Q){
			if(n < 10*Q){
				n = Round(n/(T*100));
				n = n/10;
			}else{
				n = Round(n/Q);
			}
			suffix = "Q".split('');
		}

		res = nCreateStringDecimalFromNumber(n);
		if(hasSuffix){
			res = strAppendString(res, suffix);
		}
        
		return res;
	}


	function nNumberToHumanReadableBinary(n : number) : string []{
		var res : string [], suffix : string [];
		var hasSuffix : boolean;
		var Ki : number, Mi : number, Gi : number, Ti : number, Pi : number, Ei : number, Zi : number, Yi : number;

		Ki = 1024;
		Mi = Ki*1024;
		Gi = Mi*1024;
		Ti = Gi*1024;
		Pi = Ti*1024;
		Ei = Pi*1024;
		Zi = Ei*1024;
		Yi = Zi*1024;
		suffix = " ".split('');

		if(n < Ki){
			hasSuffix = false;
		}else{
			hasSuffix = true;
		}

		if(n >= Ki && n < Mi){
			if(n < 10*Ki){
				n = Round(n/(Ki/10));
				n = n/10;
			}else{
				n = Round(n/Ki);
			}
			suffix = "Ki".split('');
		}else if(n >= Mi && n < Gi){
			if(n < 10*Mi){
				n = Round(n/(Mi/10));
				n = n/10;
			}else{
				n = Round(n/Mi);
			}
			suffix = "Mi".split('');
		}else if(n >= Gi && n < Ti){
			if(n < 10*Gi){
				n = Round(n/(Gi/10));
				n = n/10;
			}else{
				n = Round(n/Gi);
			}
			suffix = "Gi".split('');
		}else if(n >= Ti && n < Pi){
			if(n < 10*Ti){
				n = Round(n/(Ti/10));
				n = n/10;
			}else{
				n = Round(n/Ti);
			}
			suffix = "Ti".split('');
		}else if(n >= Pi && n < Ei){
			if(n < 10*Pi){
				n = Round(n/(Pi/10));
				n = n/10;
			}else{
				n = Round(n/Pi);
			}
			suffix = "Pi".split('');
		}else if(n >= Ei && n < Zi){
			if(n < 10*Ei){
				n = Round(n/(Ei/10));
				n = n/10;
			}else{
				n = Round(n/Ei);
			}
			suffix = "Ei".split('');
		}else if(n >= Zi && n < Yi){
			if(n < 10*Zi){
				n = Round(n/(Zi/10));
				n = n/10;
			}else{
				n = Round(n/Zi);
			}
			suffix = "Zi".split('');
		}else if(n >= Yi){
			if(n < 10*Yi){
				n = Round(n/(Yi/10));
				n = n/10;
			}else{
				n = Round(n/Yi);
			}
			suffix = "Yi".split('');
		}

		res = nCreateStringDecimalFromNumber(n);
		if(hasSuffix){
			res = strAppendString(res, suffix);
		}

		return res;
	}


	function nNumberToHumanReadableMetric(n : number) : string []{
		var res : string [], suffix : string [];
		var hasSuffix : boolean;
		var k : number, M : number, G : number, T : number, P : number, Ex : number, Z : number, Y : number, R : number, Q : number;

		k = 1000;
		M = k*1000;
		G = M*1000;
		T = G*1000;
		P = T*1000;
		Ex = P*1000;
		Z = Ex*1000;
		Y = Z*1000;
		R = Y*1000;
		Q = R*1000;
		suffix = " ".split('');

		if(n < k){
			hasSuffix = false;
		}else{
			hasSuffix = true;
		}

		if(n >= k && n < M){
			if(n < 10*k){
				n = Round(n/100);
				n = n/10;
			}else{
				n = Round(n/k);
			}
			suffix = "k".split('');
		}else if(n >= M && n < G){
			if(n < 10*M){
				n = Round(n/(k*100));
				n = n/10;
			}else{
				n = Round(n/M);
			}
			suffix = "M".split('');
		}else if(n >= G && n < T){
			if(n < 10*G){
				n = Round(n/(M*100));
				n = n/10;
			}else{
				n = Round(n/G);
			}
			suffix = "G".split('');
		}else if(n >= T && n < P){
			if(n < 10*T){
				n = Round(n/(G*100));
				n = n/10;
			}else{
				n = Round(n/T);
			}
			suffix = "T".split('');
		}else if(n >= P && n < Ex){
			if(n < 10*P){
				n = Round(n/(T*100));
				n = n/10;
			}else{
				n = Round(n/P);
			}
			suffix = "P".split('');
		}else if(n >= Ex && n < Z){
			if(n < 10*Ex){
				n = Round(n/(P*100));
				n = n/10;
			}else{
				n = Round(n/Ex);
			}
			suffix = "E".split('');
		}else if(n >= Z && n < Y){
			if(n < 10*Z){
				n = Round(n/(Ex*100));
				n = n/10;
			}else{
				n = Round(n/Z);
			}
			suffix = "Z".split('');
		}else if(n >= Y && n < R){
			if(n < 10*Y){
				n = Round(n/(Z*100));
				n = n/10;
			}else{
				n = Round(n/Y);
			}
			suffix = "Y".split('');
		}else if(n >= R && n < Q){
			if(n < 10*R){
				n = Round(n/(Y*100));
				n = n/10;
			}else{
				n = Round(n/R);
			}
			suffix = "R".split('');
		}else if(n >= Q){
			if(n < 10*Q){
				n = Round(n/(R*100));
				n = n/10;
			}else{
				n = Round(n/Q);
			}
			suffix = "Q".split('');
		}

		res = nCreateStringDecimalFromNumber(n);
		if(hasSuffix){
			res = strAppendString(res, suffix);
		}

		return res;
	}


	function nIsValidNumber(str : string []) : boolean{
		var valid : boolean;
		var numberRef : NumberReference;
		var message : StringReference;

		numberRef = new NumberReference();
		message = new StringReference();

		valid = nCreateNumberFromDecimalStringWithCheck(str, numberRef, message);

		numberRef = undefined;
		message = undefined;

		return valid;
	}


	function nIsValidInteger(str : string []) : boolean{
		var valid : boolean;
		var numberRef : NumberReference;
		var message : StringReference;

		numberRef = new NumberReference();
		message = new StringReference();

		valid = nCreateNumberFromDecimalStringWithCheck(str, numberRef, message);

		if(valid){
			valid = IsInteger(numberRef.numberValue);
		}

		numberRef = undefined;
		message = undefined;

		return valid;
	}


	function nIsValidPositiveInteger(str : string []) : boolean{
		var valid : boolean;
		var numberRef : NumberReference;
		var message : StringReference;

		numberRef = new NumberReference();
		message = new StringReference();

		valid = nCreateNumberFromDecimalStringWithCheck(str, numberRef, message);

		if(valid){
			valid = IsInteger(numberRef.numberValue);
			if(valid){
				valid = numberRef.numberValue >= 0;
			}
		}

		numberRef = undefined;
		message = undefined;

		return valid;
	}


	function nCreateNumberFromDecimalStringWithCheck(stringx : string [], decimalReference : NumberReference, message : StringReference) : boolean{
		return nCreateNumberFromStringWithCheck(stringx, 10, decimalReference, message);
	}


	function nCreateNumberFromDecimalString(stringx : string []) : number{
		var doubleReference : NumberReference;
		var stringReference : StringReference;
		var numberx : number;

		doubleReference = CreateNumberReference(0);
		stringReference = CreateStringReference("".split(''));
		nCreateNumberFromStringWithCheck(stringx, 10, doubleReference, stringReference);
		numberx = doubleReference.numberValue;

		doubleReference = undefined;
		stringReference = undefined;

		return numberx;
	}


	function nCreateNumberFromStringWithCheck(stringx : string [], base : number, numberReference : NumberReference, message : StringReference) : boolean{
		var success : boolean;
		var numberIsPositive : BooleanReference, exponentIsPositive : BooleanReference;
		var beforePoint : NumberArrayReference, afterPoint : NumberArrayReference, exponent : NumberArrayReference;

		numberIsPositive = CreateBooleanReference(true);
		exponentIsPositive = CreateBooleanReference(true);
		beforePoint = new NumberArrayReference();
		afterPoint = new NumberArrayReference();
		exponent = new NumberArrayReference();

		if(base >= 2 && base <= 36){
			success = nExtractPartsFromNumberString(stringx, base, numberIsPositive, beforePoint, afterPoint, exponentIsPositive, exponent, message);

			if(success){
				numberReference.numberValue = nCreateNumberFromParts(base, numberIsPositive.booleanValue, beforePoint.numberArray, afterPoint.numberArray, exponentIsPositive.booleanValue, exponent.numberArray);
			}
		}else{
			success = false;
			message.stringx = "Base must be from 2 to 36.".split('');
		}

		return success;
	}


	function nCreateNumberFromParts(base : number, numberIsPositive : boolean, beforePoint : number [], afterPoint : number [], exponentIsPositive : boolean, exponent : number []) : number{
		var n : number, i : number, p : number, e : number;

		n = 0;

		for(i = 0; i < beforePoint.length; i = i + 1){
			p = beforePoint[beforePoint.length - i - 1];

			n = n + p*base**i;
		}

		for(i = 0; i < afterPoint.length; i = i + 1){
			p = afterPoint[i];

			n = n + p/base**(i + 1);
		}

		if(exponent.length > 0){
			e = 0;
			for(i = 0; i < exponent.length; i = i + 1){
				p = exponent[exponent.length - i - 1];

				e = e + p*base**i;
			}

			if(!exponentIsPositive){
				e = -e;
			}

			n = n*base**e;
		}

		if(!numberIsPositive){
			n = -n;
		}

		return n;
	}


	function nExtractPartsFromNumberString(n : string [], base : number, numberIsPositive : BooleanReference, beforePoint : NumberArrayReference, afterPoint : NumberArrayReference, exponentIsPositive : BooleanReference, exponent : NumberArrayReference, errorMessages : StringReference) : boolean{
		var i : number, j : number, count : number;
		var success : boolean, done : boolean, complete : boolean;

		i = 0;
		complete = false;

		if(i < n.length){
			if(n[i] == '-'){
				numberIsPositive.booleanValue = false;
				i = i + 1;
			}else if(n[i] == '+'){
				numberIsPositive.booleanValue = true;
				i = i + 1;
			}

			success = true;
		}else{
			success = false;
			errorMessages.stringx = "Number cannot have length zero.".split('');
		}

		if(success){
			done = false;
			count = 0;
			for(; i + count < n.length && !done; ){
				if(nCharacterIsNumberCharacterInBase(n[i + count], base)){
					count = count + 1;
				}else{
					done = true;
				}
			}

			if(count >= 1){
				beforePoint.numberArray = new Array<number>(count);

				for(j = 0; j < count; j = j + 1){
					beforePoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
				}

				i = i + count;

				if(i < n.length){
					success = true;
				}else{
					afterPoint.numberArray = new Array<number>(0);
					exponent.numberArray = new Array<number>(0);
					success = true;
					complete = true;
				}
			}else{
				success = false;
				errorMessages.stringx = "Number must have at least one number after the optional sign.".split('');
			}
		}

		if(success && !complete){
			if(n[i] == '.'){
				i = i + 1;

				if(i < n.length){
					done = false;
					count = 0;
					for(; i + count < n.length && !done; ){
						if(nCharacterIsNumberCharacterInBase(n[i + count], base)){
							count = count + 1;
						}else{
							done = true;
						}
					}

					if(count >= 1){
						afterPoint.numberArray = new Array<number>(count);

						for(j = 0; j < count; j = j + 1){
							afterPoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
						}

						i = i + count;

						if(i < n.length){
							success = true;
						}else{
							exponent.numberArray = new Array<number>(0);
							success = true;
							complete = true;
						}
					}else{
						success = false;
						errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
					}
				}else{
					success = false;
					errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
				}
			}else if(base <= 14 && (n[i] == 'e' || n[i] == 'E')){
				if(i < n.length){
					success = true;
					afterPoint.numberArray = new Array<number>(0);
				}else{
					success = false;
					errorMessages.stringx = "There must be at least one digit after the exponent.".split('');
				}
			}else{
				success = false;
				errorMessages.stringx = "Expected decimal point or exponent symbol.".split('');
			}
		}

		if(success && !complete){
			if(base <= 14 && (n[i] == 'e' || n[i] == 'E')){
				i = i + 1;

				if(i < n.length){
					if(n[i] == '-'){
						exponentIsPositive.booleanValue = false;
						i = i + 1;
					}else if(n[i] == '+'){
						exponentIsPositive.booleanValue = true;
						i = i + 1;
					}

					if(i < n.length){
						done = false;
						count = 0;
						for(; i + count < n.length && !done; ){
							if(nCharacterIsNumberCharacterInBase(n[i + count], base)){
								count = count + 1;
							}else{
								done = true;
							}
						}

						if(count >= 1){
							exponent.numberArray = new Array<number>(count);

							for(j = 0; j < count; j = j + 1){
								exponent.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
							}

							i = i + count;

							if(i == n.length){
								success = true;
							}else{
								success = false;
								errorMessages.stringx = "There cannot be any characters past the exponent of the number.".split('');
							}
						}else{
							success = false;
							errorMessages.stringx = "There must be at least one digit after the decimal point.".split('');
						}
					}else{
						success = false;
						errorMessages.stringx = "There must be at least one digit after the exponent symbol.".split('');
					}
				}else{
					success = false;
					errorMessages.stringx = "There must be at least one digit after the exponent symbol.".split('');
				}
			}else{
				success = false;
				errorMessages.stringx = "Expected exponent symbol.".split('');
			}
		}

		return success;
	}


	function nGetNumberFromNumberCharacterForBase(c : string, base : number) : number{
		var numberTable : string [];
		var i : number;
		var position : number;

		numberTable = nGetDigitCharacterTable();
		position = 0;

		for(i = 0; i < base; i = i + 1){
			if(numberTable[i] == c){
				position = i;
			}
		}

		return position;
	}


	function nCharacterIsNumberCharacterInBase(c : string, base : number) : boolean{
		var numberTable : string [];
		var i : number;
		var found : boolean;

		numberTable = nGetDigitCharacterTable();
		found = false;

		for(i = 0; i < base; i = i + 1){
			if(numberTable[i] == c){
				found = true;
			}
		}

		return found;
	}


	function nStringToNumberArray(str : string []) : number []{
		var numberArrayReference : NumberArrayReference;
		var stringReference : StringReference;
		var numbers : number [];

		numberArrayReference = new NumberArrayReference();
		stringReference = new StringReference();

		nStringToNumberArrayWithCheck(str, numberArrayReference, stringReference);

		numbers = numberArrayReference.numberArray;

		numberArrayReference = undefined;
		stringReference = undefined;

		return numbers;
	}


	function nStringToNumberArrayWithCheck(str : string [], numberArrayReference : NumberArrayReference, errorMessage : StringReference) : boolean{
		var numberStrings : StringReference [];
		var numbers : number [];
		var i : number;
		var numberString : string [], trimmedNumberString : string [];
		var success : boolean;
		var numberReference : NumberReference;

		numberStrings = strSplitByString(str, ",".split(''));

		numbers = new Array<number>(numberStrings.length);
		success = true;
		numberReference = new NumberReference();

		for(i = 0; i < numberStrings.length; i = i + 1){
			numberString = numberStrings[i].stringx;
			trimmedNumberString = strTrim(numberString);
			success = nCreateNumberFromDecimalStringWithCheck(trimmedNumberString, numberReference, errorMessage);
			numbers[i] = numberReference.numberValue;

			FreeStringReference(numberStrings[i]);
			trimmedNumberString = undefined;
		}

		numberStrings = undefined;
		numberReference = undefined;

		numberArrayReference.numberArray = numbers;

		return success;
	}


	function Negate(x : number) : number{
		return -x;
	}


	function Positive(x : number) : number{
		return +x;
	}


	function Factorial(x : number) : number{
		var i : number, f : number;

		f = 1;

		for(i = 2; i <= x; i = i + 1){
			f = f*i;
		}

		return f;
	}


	function Round(x : number) : number{
		return Math.floor(x + 0.5);
	}


	function RoundToDigits(element : number, digitsAfterPoint : number) : number{
		return Round(element*10**digitsAfterPoint)/10**digitsAfterPoint;
	}


	function BankersRound(x : number) : number{
		var r : number;

		if(Absolute(x - Truncate(x)) == 0.5){
			if(!DivisibleBy(Round(x), 2)){
				r = Round(x) - 1;
			}else{
				r = Round(x);
			}
		}else{
			r = Round(x);
		}

		return r;
	}


	function Ceil(x : number) : number{
		return Math.ceil(x);
	}


	function Floor(x : number) : number{
		return Math.floor(x);
	}


	function Truncate(x : number) : number{
		var t : number;

		if(x >= 0){
			t = Math.floor(x);
		}else{
			t = Math.ceil(x);
		}

		return t;
	}


	function Absolute(x : number) : number{
		return Math.abs(x);
	}


	function Logarithm(x : number) : number{
		return Math.log10(x);
	}


	function NaturalLogarithm(x : number) : number{
		return Math.log(x);
	}


	function Sin(x : number) : number{
		return Math.sin(x);
	}


	function Cos(x : number) : number{
		return Math.cos(x);
	}


	function Tan(x : number) : number{
		return Math.tan(x);
	}


	function Asin(x : number) : number{
		return Math.asin(x);
	}


	function Acos(x : number) : number{
		return Math.acos(x);
	}


	function Atan(x : number) : number{
		return Math.atan(x);
	}


	function Atan2(y : number, x : number) : number{
		var a : number;

		/* Atan2 is an invalid operation when x = 0 and y = 0, but this method does not return errors.*/
		a = 0;

		if(x > 0){
			a = Atan(y/x);
		}else if(x < 0 && y >= 0){
			a = Atan(y/x) + Math.PI;
		}else if(x < 0 && y < 0){
			a = Atan(y/x) - Math.PI;
		}else if(x == 0 && y > 0){
			a = Math.PI/2;
		}else if(x == 0 && y < 0){
			a = -Math.PI/2;
		}

		return a;
	}


	function Squareroot(x : number) : number{
		return Math.sqrt(x);
	}


	function Exp(x : number) : number{
		return Math.exp(x);
	}


	function DivisibleBy(a : number, b : number) : boolean{
		return ((a%b) == 0);
	}


	function Combinations(n : number, k : number) : number{
		var i : number, j : number, c : number;

		c = 1;
		j = 1;
		i = n - k + 1;

		for(; i <= n; ){
			c = c*i;
			c = c/j;

			i = i + 1;
			j = j + 1;
		}

		return c;
	}


	function Permutations(n : number, k : number) : number{
		var i : number, c : number;

		c = 1;

		for(i = n - k + 1; i <= n; i = i + 1){
			c = c*i;
		}

		return c;
	}


	function EpsilonCompare(a : number, b : number, epsilon : number) : boolean{
		return Math.abs(a - b) < epsilon;
	}


	function GreatestCommonDivisor(a : number, b : number) : number{
		var t : number;

		for(; b != 0; ){
			t = b;
			b = a%b;
			a = t;
		}

		return a;
	}


	function GCDWithSubtraction(a : number, b : number) : number{
		var g : number;

		if(a == 0){
			g = b;
		}else{
			for(; b != 0; ){
				if(a > b){
					a = a - b;
				}else{
					b = b - a;
				}
			}

			g = a;
		}

		return g;
	}


	function IsInteger(a : number) : boolean{
		return (a - Math.floor(a)) == 0;
	}


	function GreatestCommonDivisorWithCheck(a : number, b : number, gcdReference : NumberReference) : boolean{
		var success : boolean;
		var gcd : number;

		if(IsInteger(a) && IsInteger(b)){
			gcd = GreatestCommonDivisor(a, b);
			gcdReference.numberValue = gcd;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function LeastCommonMultiple(a : number, b : number) : number{
		var lcm : number;

		if(a > 0 && b > 0){
			lcm = Math.abs(a*b)/GreatestCommonDivisor(a, b);
		}else{
			lcm = 0;
		}

		return lcm;
	}


	function Sign(a : number) : number{
		var s : number;

		if(a > 0){
			s = 1;
		}else if(a < 0){
			s = -1;
		}else{
			s = 0;
		}

		return s;
	}


	function Max(a : number, b : number) : number{
		return Math.max(a, b);
	}


	function Min(a : number, b : number) : number{
		return Math.min(a, b);
	}


	function Power(a : number, b : number) : number{
		return a**b;
	}


	function Gamma(x : number) : number{
		return LanczosApproximation(x);
	}


	function LogGamma(x : number) : number{
		return Math.log(Gamma(x));
	}


	function LanczosApproximation(z : number) : number{
		var p : number [];
		var i : number, y : number, t : number, x : number;

		p = new Array<number>(8);
		p[0] = 676.5203681218851;
		p[1] = -1259.1392167224028;
		p[2] = 771.32342877765313;
		p[3] = -176.61502916214059;
		p[4] = 12.507343278686905;
		p[5] = -0.13857109526572012;
		p[6] = 9.9843695780195716e-6;
		p[7] = 1.5056327351493116e-7;

		if(z < 0.5){
			y = Math.PI/(Math.sin(Math.PI*z)*LanczosApproximation(1 - z));
		}else{
			z = z - 1;
			x = 0.99999999999980993;
			for(i = 0; i < p.length; i = i + 1){
				x = x + p[i]/(z + i + 1);
			}
			t = z + p.length - 0.5;
			y = Math.sqrt(2*Math.PI)*t**(z + 0.5)*Math.exp(-t)*x;
		}

		return y;
	}


	function Beta(x : number, y : number) : number{
		return Gamma(x)*Gamma(y)/Gamma(x + y);
	}


	function Sinh(x : number) : number{
		return (Math.exp(x) - Math.exp(-x))/2;
	}


	function Cosh(x : number) : number{
		return (Math.exp(x) + Math.exp(-x))/2;
	}


	function Tanh(x : number) : number{
		return Sinh(x)/Cosh(x);
	}


	function Cot(x : number) : number{
		return 1/Math.tan(x);
	}


	function Sec(x : number) : number{
		return 1/Math.cos(x);
	}


	function Csc(x : number) : number{
		return 1/Math.sin(x);
	}


	function Coth(x : number) : number{
		return Cosh(x)/Sinh(x);
	}


	function Sech(x : number) : number{
		return 1/Cosh(x);
	}


	function Csch(x : number) : number{
		return 1/Sinh(x);
	}


	function Errorx(x : number) : number{
		var y : number, t : number, tau : number, c1 : number, c2 : number, c3 : number, c4 : number, c5 : number, c6 : number, c7 : number, c8 : number, c9 : number, c10 : number;

		if(x == 0){
			y = 0;
		}else if(x < 0){
			y = -Errorx(-x);
		}else{
			c1 = -1.26551223;
			c2 = +1.00002368;
			c3 = +0.37409196;
			c4 = +0.09678418;
			c5 = -0.18628806;
			c6 = +0.27886807;
			c7 = -1.13520398;
			c8 = +1.48851587;
			c9 = -0.82215223;
			c10 = +0.17087277;

			t = 1/(1 + 0.5*Math.abs(x));

			tau = t*Math.exp(-(x**2) + c1 + t*(c2 + t*(c3 + t*(c4 + t*(c5 + t*(c6 + t*(c7 + t*(c8 + t*(c9 + t*c10)))))))));

			y = 1 - tau;
		}

		return y;
	}


	function ErrorInverse(x : number) : number{
		var y : number, a : number, t : number;

		a = (8*(Math.PI - 3))/(3*Math.PI*(4 - Math.PI));

		t = 2/(Math.PI*a) + Math.log(1 - x**2)/2;
		y = Sign(x)*Math.sqrt(Math.sqrt(t**2 - Math.log(1 - x**2)/a) - t);

		return y;
	}


	function FallingFactorial(x : number, n : number) : number{
		var k : number, y : number;

		y = 1;

		for(k = 0; k <= n - 1; k = k + 1){
			y = y*(x - k);
		}

		return y;
	}


	function RisingFactorial(x : number, n : number) : number{
		var k : number, y : number;

		y = 1;

		for(k = 0; k <= n - 1; k = k + 1){
			y = y*(x + k);
		}

		return y;
	}


	function Hypergeometric(a : number, b : number, c : number, z : number, maxIterations : number, precision : number) : number{
		var y : number;

		if(Math.abs(z) >= 0.5){
			y = (1 - z)**(-a)*HypergeometricDirect(a, c - b, c, z/(z - 1), maxIterations, precision);
		}else{
			y = HypergeometricDirect(a, b, c, z, maxIterations, precision);
		}

		return y;
	}


	function HypergeometricDirect(a : number, b : number, c : number, z : number, maxIterations : number, precision : number) : number{
		var y : number, yp : number, n : number;
		var done : boolean;

		y = 0;
		done = false;

		for(n = 0; n < maxIterations && !done; n = n + 1){
			yp = RisingFactorial(a, n)*RisingFactorial(b, n)/RisingFactorial(c, n)*z**n/Factorial(n);
			if(Math.abs(yp) < precision){
				done = true;
			}
			y = y + yp;
		}

		return y;
	}


	function BernouilliNumber(n : number) : number{
		return AkiyamaTanigawaAlgorithm(n);
	}


	function AkiyamaTanigawaAlgorithm(n : number) : number{
		var m : number, j : number, B : number;
		var A : number [];

		A = new Array<number>(n + 1);

		for(m = 0; m <= n; m = m + 1){
			A[m] = 1/(m + 1);
			for(j = m; j >= 1; j = j - 1){
				A[j - 1] = j*(A[j - 1] - A[j]);
			}
		}

		B = A[0];

		A = undefined;

		return B;
	}


	function D15Add(a : number, b : number, overflow : BooleanReference) : number{
		var x : number;

		x = a + b;

		if(x > D15MaxValue() || x < D15MinValue()){
			overflow.booleanValue = true;
			x = 0;
		}else{
			overflow.booleanValue = false;
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function RoundTo15Digits(x : number) : number{
		var p : number;

		p = Math.floor(Math.log10(x));
		x = x*10**(15 - p);
		x = Round(x);
		x = x/10**(15 - p);

		return x;
	}


	function D15MaxValue() : number{
		return +9.99999999999999e99;
	}


	function D15MinValue() : number{
		return -9.99999999999999e99;
	}


	function D15Multiply(a : number, b : number, overflow : BooleanReference) : number{
		var x : number;

		x = a*b;

		if(x > D15MaxValue() || x < D15MinValue()){
			overflow.booleanValue = true;
			x = 0;
		}else{
			overflow.booleanValue = false;
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Divide(a : number, b : number, reminder : NumberReference, overflow : BooleanReference, invalidOperation : BooleanReference) : number{
		var x : number, r : number;

		if(b != 0){
			invalidOperation.booleanValue = false;

			x = a/b;
			r = a%b;

			if(x > D15MaxValue() || x < D15MinValue()){
				overflow.booleanValue = true;
				x = 0;
				r = 0;
			}else{
				overflow.booleanValue = false;
				x = RoundTo15Digits(x);
				r = RoundTo15Digits(r);
			}
		}else{
			invalidOperation.booleanValue = true;
			overflow.booleanValue = false;
			x = 0;
			r = 0;
		}

		reminder.numberValue = r;

		return x;
	}


	function D15Exponentiation(a : number, b : number, overflow : BooleanReference, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a == 0 && b == 0){
			invalidOperation.booleanValue = true;
			overflow.booleanValue = false;
			x = 0;
		}else if(a < 0 && !IsInteger(b)){
			invalidOperation.booleanValue = true;
			overflow.booleanValue = false;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;

			x = a**b;

			if(x > D15MaxValue() || x < D15MinValue()){
				overflow.booleanValue = true;
				x = 0;
			}else{
				overflow.booleanValue = false;
				x = RoundTo15Digits(x);
			}
		}

		return x;
	}


	function D15Modulus(a : number, b : number, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a < 0 || b == 0 || b < 0){
			invalidOperation.booleanValue = true;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;
			x = a%b;
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Logarithm(a : number, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a <= 0){
			invalidOperation.booleanValue = true;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;
			x = Math.log10(a);
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15NaturalLogarithm(a : number, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a <= 0){
			invalidOperation.booleanValue = true;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;
			x = Math.log(a);
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Sin(a : number) : number{
		var x : number;

		x = Math.sin(a);
		x = RoundTo15Digits(x);

		return x;
	}


	function D15Cos(x : number) : number{
		var a : number, y : number, piBy2Part1 : number, piBy2Part2 : number, limit : number, f : number;

		x = Math.abs(x);

		limit = Math.PI + 3.1/2;

		if(x > limit){
			f = Math.floor(x/Math.PI);
			x = x - Math.PI*f;
		}

		piBy2Part1 = +1.57079632679490;
		piBy2Part2 = -3.38076867830836e-15;

		if(x > 3.1/2 && x < 3.3/2){
			a = x - piBy2Part1;
			a = Math.round(a*10**15)/10**15;
			a = a - piBy2Part2;
			y = -Math.sin(a);
		}else{
			y = Math.cos(x);
			y = RoundTo15Digits(y);
		}

		return y;
	}


	function D15Tan(a : number, overflow : BooleanReference) : number{
		var x : number;

		x = Math.tan(a);

		if(x > D15MaxValue() || x < D15MinValue()){
			overflow.booleanValue = true;
			x = 0;
		}else{
			overflow.booleanValue = false;
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Asin(a : number, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a < -1 || a > 1){
			invalidOperation.booleanValue = true;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;
			x = Math.asin(a);
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Acos(a : number, invalidOperation : BooleanReference) : number{
		var x : number;

		if(a < -1 || a > 1){
			invalidOperation.booleanValue = true;
			x = 0;
		}else{
			invalidOperation.booleanValue = false;
			x = Math.acos(a);
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function D15Atan(a : number) : number{
		var x : number;

		x = Math.atan(a);
		x = RoundTo15Digits(x);

		return x;
	}


	function D15Sqrt(a : number) : number{
		var x : number;

		x = Math.sqrt(a);
		x = RoundTo15Digits(x);

		return x;
	}


	function D15Exponential(a : number, overflow : BooleanReference) : number{
		var x : number;

		x = Math.exp(a);

		if(x > D15MaxValue() || x < D15MinValue()){
			overflow.booleanValue = true;
			x = 0;
		}else{
			overflow.booleanValue = false;
			x = RoundTo15Digits(x);
		}

		return x;
	}


	function Decimal15E2ToString(decimal : number) : string []{
		var multiplier : number, inc : number, i : number, d : number;
		var exponent : number;
		var done : boolean, isPositive : boolean, isPositiveExponent : boolean;
		var result : string [];
		var len : number;

		len = 21;
		/* 1+1+1+14+1+1+2 -- "+0.00000000000000e+00"*/
		result = new Array<string>(len);

		done = false;
		exponent = 0;

		if(decimal < 0){
			isPositive = false;
			decimal = -decimal;
		}else{
			isPositive = true;
		}

		if(decimal == 0){
			done = true;
		}

		if(!done){
			multiplier = 0;
			inc = 0;

			if(decimal < 1){
				multiplier = 10;
				inc = -1;
			}else if(decimal >= 10){
				multiplier = 0.1;
				inc = 1;
			}else{
				done = true;
			}

			if(!done){
				exponent = Math.round(Math.log10(decimal));
				exponent = Math.min(99, exponent);
				exponent = Math.max(-99, exponent);

				decimal = decimal/10**exponent;

				/* Adjust*/
				for(; (decimal >= 10 || decimal < 1) && Math.abs(exponent) < 99; ){
					decimal = decimal*multiplier;
					exponent = exponent + inc;
				}
			}
		}

		isPositiveExponent = exponent >= 0;
		if(!isPositiveExponent){
			exponent = -exponent;
		}

		if(isPositive){
			result[0] = '+';
		}else{
			result[0] = '-';
		}

		decimal = Math.round(decimal*10**14);

		d = Math.floor(decimal/10**14);
		result[1] = SingleDigitNumberToCharacter(d);
		decimal = decimal - d*10**14;

		result[2] = '.';

		for(i = 0; i < 14; i = i + 1){
			d = Math.floor(decimal/10**(13 - i));
			result[3 + i] = SingleDigitNumberToCharacter(d);
			decimal = decimal - d*10**(13 - i);
		}

		result[17] = 'e';

		if(isPositiveExponent){
			result[18] = '+';
		}else{
			result[18] = '-';
		}

		result[19] = SingleDigitNumberToCharacter(Math.floor(exponent/10));
		result[20] = SingleDigitNumberToCharacter(Math.floor(exponent%10));

		return result;
	}


	function SingleDigitNumberToCharacter(n : number) : string{
		var c : string;

		c = '0';
		if(n == 0){
			c = '0';
		}else if(n == 1){
			c = '1';
		}else if(n == 2){
			c = '2';
		}else if(n == 3){
			c = '3';
		}else if(n == 4){
			c = '4';
		}else if(n == 5){
			c = '5';
		}else if(n == 6){
			c = '6';
		}else if(n == 7){
			c = '7';
		}else if(n == 8){
			c = '8';
		}else if(n == 9){
			c = '9';
		}

		return c;
	}


	function StringToNumberArray(stringx : string []) : number []{
		var i : number;
		var array : number [];

		array = new Array<number>(stringx.length);

		for(i = 0; i < stringx.length; i = i + 1){
			array[i] = stringx[i].charCodeAt(0);
		}
		return array;
	}


	function NumberArrayToString(array : number []) : string []{
		var i : number;
		var stringx : string [];

		stringx = new Array<string>(array.length);

		for(i = 0; i < array.length; i = i + 1){
			stringx[i] = String.fromCharCode(array[i]);
		}
		return stringx;
	}


	function NumberArraysEqual(a : number [], b : number []) : boolean{
		var equal : boolean;
		var i : number;

		equal = true;
		if(a.length == b.length){
			for(i = 0; i < a.length && equal; i = i + 1){
				if(a[i] != b[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function BooleanArraysEqual(a : boolean [], b : boolean []) : boolean{
		var equal : boolean;
		var i : number;

		equal = true;
		if(a.length == b.length){
			for(i = 0; i < a.length && equal; i = i + 1){
				if(a[i] != b[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function StringsEqual(a : string [], b : string []) : boolean{
		var equal : boolean;
		var i : number;

		equal = true;
		if(a.length == b.length){
			for(i = 0; i < a.length && equal; i = i + 1){
				if(a[i] != b[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function FillNumberArray(a : number [], value : number) : void{
		var i : number;

		for(i = 0; i < a.length; i = i + 1){
			a[i] = value;
		}
	}


	function FillString(a : string [], value : string) : void{
		var i : number;

		for(i = 0; i < a.length; i = i + 1){
			a[i] = value;
		}
	}


	function FillBooleanArray(a : boolean [], value : boolean) : void{
		var i : number;

		for(i = 0; i < a.length; i = i + 1){
			a[i] = value;
		}
	}


	function FillNumberArrayRange(a : number [], value : number, fromx : number, to : number) : boolean{
		var i : number, length : number;
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			for(i = 0; i < length; i = i + 1){
				a[fromx + i] = value;
			}

			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function FillBooleanArrayRange(a : boolean [], value : boolean, fromx : number, to : number) : boolean{
		var i : number, length : number;
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			for(i = 0; i < length; i = i + 1){
				a[fromx + i] = value;
			}

			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function FillStringRange(a : string [], value : string, fromx : number, to : number) : boolean{
		var i : number, length : number;
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			for(i = 0; i < length; i = i + 1){
				a[fromx + i] = value;
			}

			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function CopyNumberArray(a : number []) : number []{
		var i : number;
		var n : number [];

		n = new Array<number>(a.length);

		for(i = 0; i < a.length; i = i + 1){
			n[i] = a[i];
		}

		return n;
	}


	function CopyBooleanArray(a : boolean []) : boolean []{
		var i : number;
		var n : boolean [];

		n = new Array<boolean>(a.length);

		for(i = 0; i < a.length; i = i + 1){
			n[i] = a[i];
		}

		return n;
	}


	function CopyString(a : string []) : string []{
		var i : number;
		var n : string [];

		n = new Array<string>(a.length);

		for(i = 0; i < a.length; i = i + 1){
			n[i] = a[i];
		}

		return n;
	}


	function CopyNumberArrayRange(a : number [], fromx : number, to : number, copyReference : NumberArrayReference) : boolean{
		var i : number, length : number;
		var n : number [];
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			n = new Array<number>(length);

			for(i = 0; i < length; i = i + 1){
				n[i] = a[fromx + i];
			}

			copyReference.numberArray = n;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function CopyBooleanArrayRange(a : boolean [], fromx : number, to : number, copyReference : BooleanArrayReference) : boolean{
		var i : number, length : number;
		var n : boolean [];
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			n = new Array<boolean>(length);

			for(i = 0; i < length; i = i + 1){
				n[i] = a[fromx + i];
			}

			copyReference.booleanArray = n;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function CopyStringRange(a : string [], fromx : number, to : number, copyReference : StringReference) : boolean{
		var i : number, length : number;
		var n : string [];
		var success : boolean;

		if(fromx >= 0 && fromx <= a.length && to >= 0 && to <= a.length && fromx <= to){
			length = to - fromx;
			n = new Array<string>(length);

			for(i = 0; i < length; i = i + 1){
				n[i] = a[fromx + i];
			}

			copyReference.stringx = n;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function IsLastElement(length : number, index : number) : boolean{
		return index + 1 == length;
	}


	function CreateNumberArray(length : number, value : number) : number []{
		var array : number [];

		array = new Array<number>(length);
		FillNumberArray(array, value);

		return array;
	}


	function CreateBooleanArray(length : number, value : boolean) : boolean []{
		var array : boolean [];

		array = new Array<boolean>(length);
		FillBooleanArray(array, value);

		return array;
	}


	function CreateString(length : number, value : string) : string []{
		var array : string [];

		array = new Array<string>(length);
		FillString(array, value);

		return array;
	}


	function SwapElementsOfNumberArray(A : number [], ai : number, bi : number) : void{
		var tmp : number;

		tmp = A[ai];
		A[ai] = A[bi];
		A[bi] = tmp;
	}


	function SwapElementsOfStringArray(A : StringArrayReference, ai : number, bi : number) : void{
		var tmp : StringReference;

		tmp = A.stringArray[ai];
		A.stringArray[ai] = A.stringArray[bi];
		A.stringArray[bi] = tmp;
	}


	function ReverseNumberArray(array : number []) : void{
		var i : number;

		for(i = 0; i < array.length/2; i = i + 1){
			SwapElementsOfNumberArray(array, i, array.length - i - 1);
		}
	}


	function charToLowerCase(character : string) : string{
		var toReturn : string;

		toReturn = character;
		if(character == 'A'){
			toReturn = 'a';
		}else if(character == 'B'){
			toReturn = 'b';
		}else if(character == 'C'){
			toReturn = 'c';
		}else if(character == 'D'){
			toReturn = 'd';
		}else if(character == 'E'){
			toReturn = 'e';
		}else if(character == 'F'){
			toReturn = 'f';
		}else if(character == 'G'){
			toReturn = 'g';
		}else if(character == 'H'){
			toReturn = 'h';
		}else if(character == 'I'){
			toReturn = 'i';
		}else if(character == 'J'){
			toReturn = 'j';
		}else if(character == 'K'){
			toReturn = 'k';
		}else if(character == 'L'){
			toReturn = 'l';
		}else if(character == 'M'){
			toReturn = 'm';
		}else if(character == 'N'){
			toReturn = 'n';
		}else if(character == 'O'){
			toReturn = 'o';
		}else if(character == 'P'){
			toReturn = 'p';
		}else if(character == 'Q'){
			toReturn = 'q';
		}else if(character == 'R'){
			toReturn = 'r';
		}else if(character == 'S'){
			toReturn = 's';
		}else if(character == 'T'){
			toReturn = 't';
		}else if(character == 'U'){
			toReturn = 'u';
		}else if(character == 'V'){
			toReturn = 'v';
		}else if(character == 'W'){
			toReturn = 'w';
		}else if(character == 'X'){
			toReturn = 'x';
		}else if(character == 'Y'){
			toReturn = 'y';
		}else if(character == 'Z'){
			toReturn = 'z';
		}

		return toReturn;
	}


	function charToUpperCase(character : string) : string{
		var toReturn : string;

		toReturn = character;
		if(character == 'a'){
			toReturn = 'A';
		}else if(character == 'b'){
			toReturn = 'B';
		}else if(character == 'c'){
			toReturn = 'C';
		}else if(character == 'd'){
			toReturn = 'D';
		}else if(character == 'e'){
			toReturn = 'E';
		}else if(character == 'f'){
			toReturn = 'F';
		}else if(character == 'g'){
			toReturn = 'G';
		}else if(character == 'h'){
			toReturn = 'H';
		}else if(character == 'i'){
			toReturn = 'I';
		}else if(character == 'j'){
			toReturn = 'J';
		}else if(character == 'k'){
			toReturn = 'K';
		}else if(character == 'l'){
			toReturn = 'L';
		}else if(character == 'm'){
			toReturn = 'M';
		}else if(character == 'n'){
			toReturn = 'N';
		}else if(character == 'o'){
			toReturn = 'O';
		}else if(character == 'p'){
			toReturn = 'P';
		}else if(character == 'q'){
			toReturn = 'Q';
		}else if(character == 'r'){
			toReturn = 'R';
		}else if(character == 's'){
			toReturn = 'S';
		}else if(character == 't'){
			toReturn = 'T';
		}else if(character == 'u'){
			toReturn = 'U';
		}else if(character == 'v'){
			toReturn = 'V';
		}else if(character == 'w'){
			toReturn = 'W';
		}else if(character == 'x'){
			toReturn = 'X';
		}else if(character == 'y'){
			toReturn = 'Y';
		}else if(character == 'z'){
			toReturn = 'Z';
		}

		return toReturn;
	}


	function charIsUpperCase(character : string) : boolean{
		var isUpper : boolean;

		isUpper = true;
		if(character == 'A'){
		}else if(character == 'B'){
		}else if(character == 'C'){
		}else if(character == 'D'){
		}else if(character == 'E'){
		}else if(character == 'F'){
		}else if(character == 'G'){
		}else if(character == 'H'){
		}else if(character == 'I'){
		}else if(character == 'J'){
		}else if(character == 'K'){
		}else if(character == 'L'){
		}else if(character == 'M'){
		}else if(character == 'N'){
		}else if(character == 'O'){
		}else if(character == 'P'){
		}else if(character == 'Q'){
		}else if(character == 'R'){
		}else if(character == 'S'){
		}else if(character == 'T'){
		}else if(character == 'U'){
		}else if(character == 'V'){
		}else if(character == 'W'){
		}else if(character == 'X'){
		}else if(character == 'Y'){
		}else if(character == 'Z'){
		}else{
			isUpper = false;
		}

		return isUpper;
	}


	function charIsLowerCase(character : string) : boolean{
		var isLower : boolean;

		isLower = true;
		if(character == 'a'){
		}else if(character == 'b'){
		}else if(character == 'c'){
		}else if(character == 'd'){
		}else if(character == 'e'){
		}else if(character == 'f'){
		}else if(character == 'g'){
		}else if(character == 'h'){
		}else if(character == 'i'){
		}else if(character == 'j'){
		}else if(character == 'k'){
		}else if(character == 'l'){
		}else if(character == 'm'){
		}else if(character == 'n'){
		}else if(character == 'o'){
		}else if(character == 'p'){
		}else if(character == 'q'){
		}else if(character == 'r'){
		}else if(character == 's'){
		}else if(character == 't'){
		}else if(character == 'u'){
		}else if(character == 'v'){
		}else if(character == 'w'){
		}else if(character == 'x'){
		}else if(character == 'y'){
		}else if(character == 'z'){
		}else{
			isLower = false;
		}

		return isLower;
	}


	function charIsLetter(character : string) : boolean{
		return charIsUpperCase(character) || charIsLowerCase(character);
	}


	function charIsNumber(character : string) : boolean{
		var isNumberx : boolean;

		isNumberx = true;
		if(character == '0'){
		}else if(character == '1'){
		}else if(character == '2'){
		}else if(character == '3'){
		}else if(character == '4'){
		}else if(character == '5'){
		}else if(character == '6'){
		}else if(character == '7'){
		}else if(character == '8'){
		}else if(character == '9'){
		}else{
			isNumberx = false;
		}

		return isNumberx;
	}


	function charIsWhiteSpace(character : string) : boolean{
		var isWhiteSpacex : boolean;

		isWhiteSpacex = true;
		if(character == ' '){
		}else if(character == '\t'){
		}else if(character == '\n'){
		}else if(character == '\r'){
		}else{
			isWhiteSpacex = false;
		}

		return isWhiteSpacex;
	}


	function charIsSymbol(character : string) : boolean{
		var isSymbolx : boolean;

		isSymbolx = true;
		if(character == '!'){
		}else if(character == '\"'){
		}else if(character == '#'){
		}else if(character == '$'){
		}else if(character == '%'){
		}else if(character == '&'){
		}else if(character == '\''){
		}else if(character == '('){
		}else if(character == ')'){
		}else if(character == '*'){
		}else if(character == '+'){
		}else if(character == ','){
		}else if(character == '-'){
		}else if(character == '.'){
		}else if(character == '/'){
		}else if(character == ':'){
		}else if(character == ';'){
		}else if(character == '<'){
		}else if(character == '='){
		}else if(character == '>'){
		}else if(character == '?'){
		}else if(character == '@'){
		}else if(character == '['){
		}else if(character == '\\'){
		}else if(character == ']'){
		}else if(character == '^'){
		}else if(character == '_'){
		}else if(character == '`'){
		}else if(character == '{'){
		}else if(character == '|'){
		}else if(character == '}'){
		}else if(character == '~'){
		}else{
			isSymbolx = false;
		}

		return isSymbolx;
	}


	function charCharacterIsBefore(a : string, b : string) : boolean{
		var ad : number, bd : number;

		ad = a.charCodeAt(0);
		bd = b.charCodeAt(0);

		return ad < bd;
	}


	function charDecimalDigitToCharacter(digit : number) : string{
		var c : string;
		if(digit == 1){
			c = '1';
		}else if(digit == 2){
			c = '2';
		}else if(digit == 3){
			c = '3';
		}else if(digit == 4){
			c = '4';
		}else if(digit == 5){
			c = '5';
		}else if(digit == 6){
			c = '6';
		}else if(digit == 7){
			c = '7';
		}else if(digit == 8){
			c = '8';
		}else if(digit == 9){
			c = '9';
		}else{
			c = '0';
		}
		return c;
	}


	function charCharacterToDecimalDigit(c : string) : number{
		var digit : number;

		if(c == '1'){
			digit = 1;
		}else if(c == '2'){
			digit = 2;
		}else if(c == '3'){
			digit = 3;
		}else if(c == '4'){
			digit = 4;
		}else if(c == '5'){
			digit = 5;
		}else if(c == '6'){
			digit = 6;
		}else if(c == '7'){
			digit = 7;
		}else if(c == '8'){
			digit = 8;
		}else if(c == '9'){
			digit = 9;
		}else{
			digit = 0;
		}

		return digit;
	}


	function CreateNewArrayData() : Data{
		var data : Data;

		data = new Data();
		data.isArray = true;
		data.isStruture = false;
		data.isNumber = false;
		data.isBoolean = false;
		data.isString = false;
		data.array = CreateArray();

		return data;
	}


	function CreateNewStructData() : Data{
		var data : Data;

		data = new Data();
		data.isStruture = true;
		data.isArray = false;
		data.isNumber = false;
		data.isBoolean = false;
		data.isString = false;
		data.structure = CreateStructure();

		return data;
	}


	function CreateStructure() : Structure{
		var st : Structure;

		st = new Structure();
		st.keys = CreateArray();
		st.values = CreateArray();

		return st;
	}


	function CreateNumberData(n : number) : Data{
		var data : Data;

		data = new Data();
		data.isNumber = true;
		data.isStruture = false;
		data.isArray = false;
		data.isBoolean = false;
		data.isString = false;
		data.numberx = n;

		return data;
	}


	function CreateBooleanData(b : boolean) : Data{
		var data : Data;

		data = new Data();
		data.isBoolean = true;
		data.isStruture = false;
		data.isArray = false;
		data.isNumber = false;
		data.isString = false;
		data.booleanxx = b;

		return data;
	}


	function CreateStringData(stringx : string []) : Data{
		var data : Data;

		data = new Data();
		data.isString = true;
		data.isStruture = false;
		data.isArray = false;
		data.isNumber = false;
		data.isBoolean = false;
		data.stringx = stringx;

		return data;
	}


	function CreateStructData(structure : Structure) : Data{
		var data : Data;

		data = new Data();
		data.isString = false;
		data.isStruture = true;
		data.isArray = false;
		data.isNumber = false;
		data.isBoolean = false;
		data.structure = structure;

		return data;
	}


	function CreateArrayData(array : Arrayx) : Data{
		var data : Data;

		data = new Data();
		data.isString = false;
		data.isStruture = false;
		data.isArray = true;
		data.isNumber = false;
		data.isBoolean = false;
		data.array = array;

		return data;
	}


	function CreateNoTypeData() : Data{
		var data : Data;

		data = new Data();
		data.isStruture = false;
		data.isArray = false;
		data.isNumber = false;
		data.isBoolean = false;
		data.isString = false;

		return data;
	}


	function AddStructToArray(ar : Arrayx, st : Structure) : void{
		var data : Data;

		data = CreateNewStructData();
		delete data.structure;
		data.structure = st;

		ArrayAdd(ar, data);
	}


	function AddArrayToArray(ar : Arrayx, ar2 : Arrayx) : void{
		var data : Data;

		data = CreateNewArrayData();
		delete data.array;
		data.array = ar2;

		ArrayAdd(ar, data);
	}


	function AddNumberToArray(ar : Arrayx, n : number) : void{
		ArrayAdd(ar, CreateNumberData(n));
	}


	function AddBooleanToArray(ar : Arrayx, b : boolean) : void{
		ArrayAdd(ar, CreateBooleanData(b));
	}


	function AddStringToArray(ar : Arrayx, str : string []) : void{
		ArrayAdd(ar, CreateStringData(str));
	}


	function AddDataToArray(ar : Arrayx, data : Data) : void{
		ArrayAdd(ar, data);
	}


	function StructKeys(st : Structure) : number{
		return ArrayLength(st.keys);
	}


	function StructHasKey(st : Structure, key : string []) : boolean{
		var i : number;
		var hasKey : boolean;

		hasKey = false;
		for(i = 0; i < StructKeys(st); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				hasKey = true;
			}
		}

		return hasKey;
	}


	function StructKeyIndex(st : Structure, key : string []) : number{
		var i : number;
		var index : number;

		index = -1;
		for(i = 0; i < StructKeys(st); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				index = i;
			}
		}

		return index;
	}


	function GetStructKeys(st : Structure) : StringReference []{
		var keys : StringReference [];
		var nr : number, i : number;

		nr = StructKeys(st);

		keys = new Array<StringReference>(nr);

		for(i = 0; i < nr; i = i + 1){
			keys[i] = new StringReference();
			keys[i].stringx = CopyString(st.keys.array[i].stringx);
		}

		return keys;
	}


	function GetStructFromStruct(st : Structure, key : string []) : Structure{
		var i : number;
		var r : Structure;

		r = new Structure();
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = st.values.array[i].structure;
			}
		}

		return r;
	}


	function GetArrayFromStruct(st : Structure, key : string []) : Arrayx{
		var i : number;
		var r : Arrayx;

		r = new Arrayx();
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = st.values.array[i].array;
			}
		}

		return r;
	}


	function GetNumberFromStruct(st : Structure, key : string []) : number{
		var i : number, r : number;

		r = 0;
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = st.values.array[i].numberx;
			}
		}

		return r;
	}


	function GetBooleanFromStruct(st : Structure, key : string []) : boolean{
		var i : number;
		var r : boolean;

		r = false;
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = st.values.array[i].booleanxx;
			}
		}

		return r;
	}


	function GetStringFromStruct(st : Structure, key : string []) : string []{
		var i : number;
		var r : string [];

		r = "".split('');
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = st.values.array[i].stringx;
			}
		}

		return r;
	}


	function GetDataFromStruct(st : Structure, key : string []) : Data{
		var i : number;
		var r : Data;

		r = new Data();
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = undefined;
				r = st.values.array[i];
			}
		}

		return r;
	}


	function GetDataFromStructWithCheck(st : Structure, key : string [], foundRef : BooleanReference) : Data{
		var i : number;
		var r : Data;

		r = new Data();
		foundRef.booleanValue = false;
		for(i = 0; i < ArrayLength(st.keys); i = i + 1){
			if(StringsEqual(st.keys.array[i].stringx, key)){
				r = undefined;
				foundRef.booleanValue = true;
				r = st.values.array[i];
			}
		}

		return r;
	}


	function AddStructToStruct(st : Structure, key : string [], struct : Structure) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			delete st.values.array[i].structure;
			st.values.array[i].structure = struct;
		}else{
			AddStringToArray(st.keys, key);
			AddStructToArray(st.values, struct);
		}
	}


	function AddArrayToStruct(st : Structure, key : string [], ar : Arrayx) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			delete st.values.array[i].array;
			st.values.array[i].array = ar;
		}else{
			AddStringToArray(st.keys, key);
			AddArrayToArray(st.values, ar);
		}
	}


	function AddNumberToStruct(st : Structure, key : string [], n : number) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			st.values.array[i].numberx = n;
		}else{
			AddStringToArray(st.keys, key);
			AddNumberToArray(st.values, n);
		}
	}


	function AddBooleanToStruct(st : Structure, key : string [], b : boolean) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			st.values.array[i].booleanxx = b;
		}else{
			AddStringToArray(st.keys, key);
			AddBooleanToArray(st.values, b);
		}
	}


	function AddStringToStruct(st : Structure, key : string [], value : string []) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			delete st.values.array[i].stringx;
			st.values.array[i].stringx = value;
		}else{
			AddStringToArray(st.keys, key);
			AddStringToArray(st.values, value);
		}
	}


	function AddDataToStruct(st : Structure, key : string [], data : Data) : void{
		var i : number;

		if(StructHasKey(st, key)){
			i = StructKeyIndex(st, key);
			FreeData(st.values.array[i]);
			st.values.array[i] = data;
		}else{
			AddStringToArray(st.keys, key);
			AddDataToArray(st.values, data);
		}
	}


	function FreeData(data : Data) : void{
		var i : number;
		var st : Structure;

		if(data.isStruture){
			st = data.structure;
			for(i = 0; i < StructKeys(st); i = i + 1){
				FreeData(ArrayIndex(st.keys, i));
				FreeData(ArrayIndex(st.values, i));
			}
			st = undefined;
		}else if(data.isArray){
			FreeArray(data.array);
		}

		data = undefined;
	}


	function FreeArray(array : Arrayx) : void{
		var i : number;

		for(i = 0; i < ArrayLength(array); i = i + 1){
			FreeData(array.array[i]);
		}

		delete array.array;
		array = undefined;
	}


	function DataTypeEquals(a : Data, b : Data) : boolean{
		var equal : boolean;

		equal = true;
		equal = equal && a.isStruture == b.isStruture;
		equal = equal && a.isArray == b.isArray;
		equal = equal && a.isNumber == b.isNumber;
		equal = equal && a.isBoolean == b.isBoolean;
		equal = equal && a.isString == b.isString;

		return equal;
	}


	function IsStructure(a : Data) : boolean{
		var itis : boolean;

		itis = a.isStruture;
		if(a.isArray || a.isNumber || a.isBoolean || a.isString){
			itis = false;
		}

		return itis;
	}


	function IsArray(a : Data) : boolean{
		var itis : boolean;

		itis = a.isArray;
		if(a.isStruture || a.isNumber || a.isBoolean || a.isString){
			itis = false;
		}

		return itis;
	}


	function IsNumber(a : Data) : boolean{
		var itis : boolean;

		itis = a.isNumber;
		if(a.isStruture || a.isArray || a.isBoolean || a.isString){
			itis = false;
		}

		return itis;
	}


	function IsBoolean(a : Data) : boolean{
		var itis : boolean;

		itis = a.isBoolean;
		if(a.isStruture || a.isArray || a.isNumber || a.isString){
			itis = false;
		}

		return itis;
	}


	function IsString(a : Data) : boolean{
		var itis : boolean;

		itis = a.isString;
		if(a.isStruture || a.isArray || a.isNumber || a.isBoolean){
			itis = false;
		}

		return itis;
	}


	function IsNoType(a : Data) : boolean{
		var itis : boolean;

		if(!a.isString && !a.isStruture && !a.isArray && !a.isNumber && !a.isBoolean){
			itis = true;
		}else{
			itis = false;
		}

		return itis;
	}


	function CreateArray() : Arrayx{
		var array : Arrayx;

		array = new Arrayx();
		array.array = new Array<Data>(10);
		array.length = 0;

		return array;
	}


	function CreateArrayWithInitialCapacity(capacity : number) : Arrayx{
		var array : Arrayx;

		array = new Arrayx();
		array.array = new Array<Data>(capacity);
		array.length = 0;

		return array;
	}


	function ArrayAdd(array : Arrayx, value : Data) : void{
		if(array.length == array.array.length){
			ArrayIncreaseSize(array);
		}

		array.array[array.length] = value;
		array.length = array.length + 1;
	}


	function ArrayAddString(array : Arrayx, value : string []) : void{
		var data : Data;

		data = CreateStringData(value);

		ArrayAdd(array, data);
	}


	function ArrayAddBoolean(array : Arrayx, value : boolean) : void{
		var data : Data;

		data = CreateBooleanData(value);

		ArrayAdd(array, data);
	}


	function ArrayAddNumber(array : Arrayx, value : number) : void{
		var data : Data;

		data = CreateNumberData(value);

		ArrayAdd(array, data);
	}


	function ArrayAddStruct(array : Arrayx, value : Structure) : void{
		var data : Data;

		data = CreateStructData(value);

		ArrayAdd(array, data);
	}


	function ArrayAddArray(array : Arrayx, value : Arrayx) : void{
		var data : Data;

		data = CreateArrayData(value);

		ArrayAdd(array, data);
	}


	function ArrayIncreaseSize(array : Arrayx) : void{
		var newLength : number, i : number;
		var newArray : Data [];

		newLength = Math.round(array.array.length*3/2);
		newArray = new Array<Data>(newLength);

		for(i = 0; i < array.array.length; i = i + 1){
			newArray[i] = array.array[i];
		}

		delete array.array;

		array.array = newArray;
	}


	function ArrayDecreaseSizeNecessary(array : Arrayx) : boolean{
		var needsDecrease : boolean;

		needsDecrease = false;

		if(array.length > 10){
			needsDecrease = array.length <= Math.round(array.array.length*2/3);
		}

		return needsDecrease;
	}


	function ArrayDecreaseSize(array : Arrayx) : void{
		var newLength : number, i : number;
		var newArray : Data [];

		newLength = Math.round(array.array.length*2/3);
		newArray = new Array<Data>(newLength);

		for(i = 0; i < newLength; i = i + 1){
			newArray[i] = array.array[i];
		}

		delete array.array;

		array.array = newArray;
	}


	function ArrayIndex(array : Arrayx, index : number) : Data{
		return array.array[index];
	}


	function ArrayIndexArray(array : Arrayx, index : number) : Arrayx{
		return array.array[index].array;
	}


	function ArrayIndexStruct(array : Arrayx, index : number) : Structure{
		return array.array[index].structure;
	}


	function ArrayIndexBoolean(array : Arrayx, index : number) : boolean{
		return array.array[index].booleanxx;
	}


	function ArrayIndexString(array : Arrayx, index : number) : string []{
		return array.array[index].stringx;
	}


	function ArrayIndexNumber(array : Arrayx, index : number) : number{
		return array.array[index].numberx;
	}


	function ArrayLength(array : Arrayx) : number{
		return array.length;
	}


	function ArrayInsert(array : Arrayx, index : number, value : Data) : void{
		var i : number;

		if(array.length == array.array.length){
			ArrayIncreaseSize(array);
		}

		for(i = array.length; i > index; i = i - 1){
			array.array[i] = array.array[i - 1];
		}

		array.array[index] = value;

		array.length = array.length + 1;
	}


	function ArrayInsertString(array : Arrayx, index : number, value : string []) : void{
		var data : Data;

		data = CreateStringData(value);

		ArrayInsert(array, index, data);
	}


	function ArrayInsertBoolean(array : Arrayx, index : number, value : boolean) : void{
		var data : Data;

		data = CreateBooleanData(value);

		ArrayInsert(array, index, data);
	}


	function ArrayInsertNumber(array : Arrayx, index : number, value : number) : void{
		var data : Data;

		data = CreateNumberData(value);

		ArrayInsert(array, index, data);
	}


	function ArrayInsertStruct(array : Arrayx, index : number, value : Structure) : void{
		var data : Data;

		data = CreateStructData(value);

		ArrayInsert(array, index, data);
	}


	function ArrayInsertArray(array : Arrayx, index : number, value : Arrayx) : void{
		var data : Data;

		data = CreateArrayData(value);

		ArrayInsert(array, index, data);
	}


	function ArraySet(array : Arrayx, index : number, value : Data) : boolean{
		var success : boolean;

		if(index < array.length){
			array.array[index] = value;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function ArraySetString(array : Arrayx, index : number, value : string []) : void{
		var data : Data;

		data = CreateStringData(value);

		ArraySet(array, index, data);
	}


	function ArraySetBoolean(array : Arrayx, index : number, value : boolean) : void{
		var data : Data;

		data = CreateBooleanData(value);

		ArraySet(array, index, data);
	}


	function ArraySetNumber(array : Arrayx, index : number, value : number) : void{
		var data : Data;

		data = CreateNumberData(value);

		ArraySet(array, index, data);
	}


	function ArraySetStruct(array : Arrayx, index : number, value : Structure) : void{
		var data : Data;

		data = CreateStructData(value);

		ArraySet(array, index, data);
	}


	function ArraySetArray(array : Arrayx, index : number, value : Arrayx) : void{
		var data : Data;

		data = CreateArrayData(value);

		ArraySet(array, index, data);
	}


	function ArrayRemove(array : Arrayx, index : number) : void{
		var i : number;

		for(i = index; i < array.length - 1; i = i + 1){
			array.array[i] = array.array[i + 1];
		}

		array.length = array.length - 1;

		if(ArrayDecreaseSizeNecessary(array)){
			ArrayDecreaseSize(array);
		}
	}


	function ToStaticArray(arc : Arrayx) : Data []{
		var array : Data [];
		var i : number;

		array = new Array<Data>(arc.length);

		for(i = 0; i < arc.length; i = i + 1){
			array[i] = arc.array[i];
		}

		return array;
	}


	function ToStaticNumberArray(array : Arrayx) : number []{
		var result : number [];
		var i : number, n : number;

		n = ArrayLength(array);

		result = new Array<number>(n);

		for(i = 0; i < n; i = i + 1){
			result[i] = ArrayIndex(array, i).numberx;
		}

		return result;
	}


	function ToStaticBooleanArray(array : Arrayx) : boolean []{
		var result : boolean [];
		var i : number, n : number;

		n = ArrayLength(array);

		result = new Array<boolean>(n);

		for(i = 0; i < n; i = i + 1){
			result[i] = ArrayIndex(array, i).booleanxx;
		}

		return result;
	}


	function ToStaticStringArray(array : Arrayx) : StringReference []{
		var result : StringReference [];
		var i : number, n : number;

		n = ArrayLength(array);

		result = new Array<StringReference>(n);

		for(i = 0; i < n; i = i + 1){
			result[i] = new StringReference();
			result[i].stringx = ArrayIndex(array, i).stringx;
		}

		return result;
	}


	function ToStaticArrayArray(array : Arrayx) : Arrayx []{
		var result : Arrayx [];
		var i : number, n : number;

		n = ArrayLength(array);

		result = new Array<Arrayx>(n);

		for(i = 0; i < n; i = i + 1){
			result[i] = ArrayIndex(array, i).array;
		}

		return result;
	}


	function ToStaticStructArray(array : Arrayx) : Structure []{
		var result : Structure [];
		var i : number, n : number;

		n = ArrayLength(array);

		result = new Array<Structure>(n);

		for(i = 0; i < n; i = i + 1){
			result[i] = ArrayIndex(array, i).structure;
		}

		return result;
	}


	function StaticArrayToArrayWithOptimalSize(src : Data []) : Arrayx{
		var dst : Arrayx;
		var i : number;
		var c : number, n : number, newCapacity : number;

		/*
         c = 10*(3/2)^n
         log(c) = log(10*(3/2)^n)
         log(c) = log(10) + log((3/2)^n)
         log(c) = 1 + log((3/2)^n)
         log(c) - 1 = log((3/2)^n)
         log(c) - 1 = n*log(3/2)
         n = (log(c) - 1)/log(3/2)
        */

		c = src.length;
		n = (Math.log(c) - 1)/Math.log(3/2);

		newCapacity = Math.ceil(10*(3/2)**Math.ceil(n));

		dst = CreateArrayWithInitialCapacity(newCapacity);

		for(i = 0; i < src.length; i = i + 1){
			dst.array[i] = src[i];
		}

		return dst;
	}


	function StaticArrayToArray(src : Data []) : Arrayx{
		var i : number;
		var dst : Arrayx;

		dst = CreateArrayWithInitialCapacity(src.length);
		for(i = 0; i < src.length; i = i + 1){
			dst.array[i] = src[i];
		}
		dst.length = src.length;

		return dst;
	}


	function AddNumber(list : number [], a : number) : number []{
		var newlist : number [];
		var i : number;

		newlist = new Array<number>(list.length + 1);
		for(i = 0; i < list.length; i = i + 1){
			newlist[i] = list[i];
		}
		newlist[list.length] = a;
		
		list = undefined;
		
		return newlist;
	}


	function AddNumberRef(list : NumberArrayReference, i : number) : void{
		list.numberArray = AddNumber(list.numberArray, i);
	}


	function RemoveNumber(list : number [], n : number) : number []{
		var newlist : number [];
		var i : number;

		newlist = new Array<number>(list.length - 1);

		if(n >= 0 && n < list.length){
			for(i = 0; i < list.length; i = i + 1){
				if(i < n){
					newlist[i] = list[i];
				}
				if(i > n){
					newlist[i - 1] = list[i];
				}
			}

			list = undefined;
		}else{
			newlist = undefined;
		}
		
		return newlist;
	}


	function GetNumberRef(list : NumberArrayReference, i : number) : number{
		return list.numberArray[i];
	}


	function RemoveNumberRef(list : NumberArrayReference, i : number) : void{
		list.numberArray = RemoveNumber(list.numberArray, i);
	}


	function AddString(list : StringReference [], a : StringReference) : StringReference []{
		var newlist : StringReference [];
		var i : number;

		newlist = new Array<StringReference>(list.length + 1);

		for(i = 0; i < list.length; i = i + 1){
			newlist[i] = list[i];
		}
		newlist[list.length] = a;
		
		list = undefined;
		
		return newlist;
	}


	function AddStringRef(list : StringArrayReference, i : StringReference) : void{
		list.stringArray = AddString(list.stringArray, i);
	}


	function RemoveString(list : StringReference [], n : number) : StringReference []{
		var newlist : StringReference [];
		var i : number;

		newlist = new Array<StringReference>(list.length - 1);

		if(n >= 0 && n < list.length){
			for(i = 0; i < list.length; i = i + 1){
				if(i < n){
					newlist[i] = list[i];
				}
				if(i > n){
					newlist[i - 1] = list[i];
				}
			}

			list = undefined;
		}else{
			newlist = undefined;
		}
		
		return newlist;
	}


	function GetStringRef(list : StringArrayReference, i : number) : StringReference{
		return list.stringArray[i];
	}


	function RemoveStringRef(list : StringArrayReference, i : number) : void{
		list.stringArray = RemoveString(list.stringArray, i);
	}


	function CreateDynamicArrayCharacters() : DynamicArrayCharacters{
		var da : DynamicArrayCharacters;

		da = new DynamicArrayCharacters();
		da.array = new Array<string>(10);
		da.length = 0;

		return da;
	}


	function CreateDynamicArrayCharactersWithInitialCapacity(capacity : number) : DynamicArrayCharacters{
		var da : DynamicArrayCharacters;

		da = new DynamicArrayCharacters();
		da.array = new Array<string>(capacity);
		da.length = 0;

		return da;
	}


	function DynamicArrayAddCharacter(da : DynamicArrayCharacters, value : string) : void{
		if(da.length == da.array.length){
			DynamicArrayCharactersIncreaseSize(da);
		}

		da.array[da.length] = value;
		da.length = da.length + 1;
	}


	function DynamicArrayAddString(da : DynamicArrayCharacters, str : string []) : void{
		var i : number;

		for(i = 0; i < str.length; i = i + 1){
			DynamicArrayAddCharacter(da, str[i]);
		}
	}


	function DynamicArrayCharactersIncreaseSize(da : DynamicArrayCharacters) : void{
		var newLength : number, i : number;
		var newArray : string [];

		newLength = Math.round(da.array.length*3/2);
		newArray = new Array<string>(newLength);

		for(i = 0; i < da.array.length; i = i + 1){
			newArray[i] = da.array[i];
		}

		delete da.array;

		da.array = newArray;
	}


	function DynamicArrayCharactersDecreaseSizeNecessary(da : DynamicArrayCharacters) : boolean{
		var needsDecrease : boolean;

		needsDecrease = false;

		if(da.length > 10){
			needsDecrease = da.length <= Math.round(da.array.length*2/3);
		}

		return needsDecrease;
	}


	function DynamicArrayCharactersDecreaseSize(da : DynamicArrayCharacters) : void{
		var newLength : number, i : number;
		var newArray : string [];

		newLength = Math.round(da.array.length*2/3);
		newArray = new Array<string>(newLength);

		for(i = 0; i < newLength; i = i + 1){
			newArray[i] = da.array[i];
		}

		delete da.array;

		da.array = newArray;
	}


	function DynamicArrayCharactersIndex(da : DynamicArrayCharacters, index : number) : string{
		return da.array[index];
	}


	function DynamicArrayCharactersLength(da : DynamicArrayCharacters) : number{
		return da.length;
	}


	function DynamicArrayInsertCharacter(da : DynamicArrayCharacters, index : number, value : string) : void{
		var i : number;

		if(da.length == da.array.length){
			DynamicArrayCharactersIncreaseSize(da);
		}

		for(i = da.length; i > index; i = i - 1){
			da.array[i] = da.array[i - 1];
		}

		da.array[index] = value;

		da.length = da.length + 1;
	}


	function DynamicArrayCharacterSet(da : DynamicArrayCharacters, index : number, value : string) : boolean{
		var success : boolean;

		if(index < da.length){
			da.array[index] = value;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function DynamicArrayRemoveCharacter(da : DynamicArrayCharacters, index : number) : void{
		var i : number;

		for(i = index; i < da.length - 1; i = i + 1){
			da.array[i] = da.array[i + 1];
		}

		da.length = da.length - 1;

		if(DynamicArrayCharactersDecreaseSizeNecessary(da)){
			DynamicArrayCharactersDecreaseSize(da);
		}
	}


	function FreeDynamicArrayCharacters(da : DynamicArrayCharacters) : void{
		delete da.array;
		da = undefined;
	}


	function DynamicArrayCharactersToArray(da : DynamicArrayCharacters) : string []{
		var array : string [];
		var i : number;

		array = new Array<string>(da.length);

		for(i = 0; i < da.length; i = i + 1){
			array[i] = da.array[i];
		}

		return array;
	}


	function ArrayToDynamicArrayCharactersWithOptimalSize(array : string []) : DynamicArrayCharacters{
		var da : DynamicArrayCharacters;
		var i : number;
		var c : number, n : number, newCapacity : number;

		c = array.length;
		n = (Math.log(c) - 1)/Math.log(3/2);
		newCapacity = Math.ceil(10*(3/2)**n);

		da = CreateDynamicArrayCharactersWithInitialCapacity(newCapacity);

		for(i = 0; i < array.length; i = i + 1){
			da.array[i] = array[i];
		}

		return da;
	}


	function ArrayToDynamicArrayCharacters(array : string []) : DynamicArrayCharacters{
		var da : DynamicArrayCharacters;

		da = new DynamicArrayCharacters();
		da.array = CopyString(array);
		da.length = array.length;

		return da;
	}


	function DynamicArrayCharactersEqual(a : DynamicArrayCharacters, b : DynamicArrayCharacters) : boolean{
		var equal : boolean;
		var i : number;

		equal = true;
		if(a.length == b.length){
			for(i = 0; i < a.length && equal; i = i + 1){
				if(a.array[i] != b.array[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function DynamicArrayCharactersToLinkedList(da : DynamicArrayCharacters) : LinkedListCharacters{
		var ll : LinkedListCharacters;
		var i : number;

		ll = CreateLinkedListCharacter();

		for(i = 0; i < da.length; i = i + 1){
			LinkedListAddCharacter(ll, da.array[i]);
		}

		return ll;
	}


	function LinkedListToDynamicArrayCharacters(ll : LinkedListCharacters) : DynamicArrayCharacters{
		var da : DynamicArrayCharacters;
		var i : number;
		var node : LinkedListNodeCharacters;

		node = ll.first;

		da = new DynamicArrayCharacters();
		da.length = LinkedListCharactersLength(ll);

		da.array = new Array<string>(da.length);

		for(i = 0; i < da.length; i = i + 1){
			da.array[i] = node.value;
			node = node.next;
		}

		return da;
	}


	function AddBoolean(list : boolean [], a : boolean) : boolean []{
		var newlist : boolean [];
		var i : number;

		newlist = new Array<boolean>(list.length + 1);
		for(i = 0; i < list.length; i = i + 1){
			newlist[i] = list[i];
		}
		newlist[list.length] = a;
		
		list = undefined;
		
		return newlist;
	}


	function AddBooleanRef(list : BooleanArrayReference, i : boolean) : void{
		list.booleanArray = AddBoolean(list.booleanArray, i);
	}


	function RemoveBoolean(list : boolean [], n : number) : boolean []{
		var newlist : boolean [];
		var i : number;

		newlist = new Array<boolean>(list.length - 1);

		if(n >= 0 && n < list.length){
			for(i = 0; i < list.length; i = i + 1){
				if(i < n){
					newlist[i] = list[i];
				}
				if(i > n){
					newlist[i - 1] = list[i];
				}
			}

			list = undefined;
		}else{
			newlist = undefined;
		}
		
		return newlist;
	}


	function GetBooleanRef(list : BooleanArrayReference, i : number) : boolean{
		return list.booleanArray[i];
	}


	function RemoveDecimalRef(list : BooleanArrayReference, i : number) : void{
		list.booleanArray = RemoveBoolean(list.booleanArray, i);
	}


	function CreateLinkedListString() : LinkedListStrings{
		var ll : LinkedListStrings;

		ll = new LinkedListStrings();
		ll.first = new LinkedListNodeStrings();
		ll.last = ll.first;
		ll.last.end = true;

		return ll;
	}


	function LinkedListAddString(ll : LinkedListStrings, value : string []) : void{
		ll.last.end = false;
		ll.last.value = value;
		ll.last.next = new LinkedListNodeStrings();
		ll.last.next.end = true;
		ll.last = ll.last.next;
	}


	function LinkedListStringsToArray(ll : LinkedListStrings) : StringReference []{
		var array : StringReference [];
		var length : number, i : number;
		var node : LinkedListNodeStrings;

		node = ll.first;

		length = LinkedListStringsLength(ll);

		array = new Array<StringReference>(length);

		for(i = 0; i < length; i = i + 1){
			array[i] = new StringReference();
			array[i].stringx = node.value;
			node = node.next;
		}

		return array;
	}


	function LinkedListStringsLength(ll : LinkedListStrings) : number{
		var l : number;
		var node : LinkedListNodeStrings;

		l = 0;
		node = ll.first;
		for(; !node.end; ){
			node = node.next;
			l = l + 1;
		}

		return l;
	}


	function FreeLinkedListString(ll : LinkedListStrings) : void{
		var node : LinkedListNodeStrings, prev : LinkedListNodeStrings;

		node = ll.first;

		for(; !node.end; ){
			prev = node;
			node = node.next;
			prev = undefined;
		}

		node = undefined;
	}


	function LinkedListInsertString(ll : LinkedListStrings, index : number, value : string []) : void{
		var i : number;
		var node : LinkedListNodeStrings, tmp : LinkedListNodeStrings;

		if(index == 0){
			tmp = ll.first;
			ll.first = new LinkedListNodeStrings();
			ll.first.next = tmp;
			ll.first.value = value;
			ll.first.end = false;
		}else{
			node = ll.first;
			for(i = 0; i < index - 1; i = i + 1){
				node = node.next;
			}

			tmp = node.next;
			node.next = new LinkedListNodeStrings();
			node.next.next = tmp;
			node.next.value = value;
			node.next.end = false;
		}
	}


	function CreateLinkedListNumbers() : LinkedListNumbers{
		var ll : LinkedListNumbers;

		ll = new LinkedListNumbers();
		ll.first = new LinkedListNodeNumbers();
		ll.last = ll.first;
		ll.last.end = true;

		return ll;
	}


	function CreateLinkedListNumbersArray(length : number) : LinkedListNumbers []{
		var lls : LinkedListNumbers [];
		var i : number;

		lls = new Array<LinkedListNumbers>(length);
		for(i = 0; i < lls.length; i = i + 1){
			lls[i] = CreateLinkedListNumbers();
		}

		return lls;
	}


	function LinkedListAddNumber(ll : LinkedListNumbers, value : number) : void{
		ll.last.end = false;
		ll.last.value = value;
		ll.last.next = new LinkedListNodeNumbers();
		ll.last.next.end = true;
		ll.last = ll.last.next;
	}


	function LinkedListNumbersLength(ll : LinkedListNumbers) : number{
		var l : number;
		var node : LinkedListNodeNumbers;

		l = 0;
		node = ll.first;
		for(; !node.end; ){
			node = node.next;
			l = l + 1;
		}

		return l;
	}


	function LinkedListNumbersIndex(ll : LinkedListNumbers, index : number) : number{
		var i : number;
		var node : LinkedListNodeNumbers;

		node = ll.first;
		for(i = 0; i < index; i = i + 1){
			node = node.next;
		}

		return node.value;
	}


	function LinkedListInsertNumber(ll : LinkedListNumbers, index : number, value : number) : void{
		var i : number;
		var node : LinkedListNodeNumbers, tmp : LinkedListNodeNumbers;

		if(index == 0){
			tmp = ll.first;
			ll.first = new LinkedListNodeNumbers();
			ll.first.next = tmp;
			ll.first.value = value;
			ll.first.end = false;
		}else{
			node = ll.first;
			for(i = 0; i < index - 1; i = i + 1){
				node = node.next;
			}

			tmp = node.next;
			node.next = new LinkedListNodeNumbers();
			node.next.next = tmp;
			node.next.value = value;
			node.next.end = false;
		}
	}


	function LinkedListSet(ll : LinkedListNumbers, index : number, value : number) : void{
		var i : number;
		var node : LinkedListNodeNumbers;

		node = ll.first;
		for(i = 0; i < index; i = i + 1){
			node = node.next;
		}

		node.next.value = value;
	}


	function LinkedListRemoveNumber(ll : LinkedListNumbers, index : number) : void{
		var i : number;
		var node : LinkedListNodeNumbers, prev : LinkedListNodeNumbers;

		node = ll.first;
		prev = ll.first;

		for(i = 0; i < index; i = i + 1){
			prev = node;
			node = node.next;
		}

		if(index == 0){
			ll.first = prev.next;
		}
		if(!prev.next.end){
			prev.next = prev.next.next;
		}
	}


	function FreeLinkedListNumbers(ll : LinkedListNumbers) : void{
		var node : LinkedListNodeNumbers, prev : LinkedListNodeNumbers;

		node = ll.first;

		for(; !node.end; ){
			prev = node;
			node = node.next;
			prev = undefined;
		}

		node = undefined;
	}


	function FreeLinkedListNumbersArray(lls : LinkedListNumbers []) : void{
		var i : number;

		for(i = 0; i < lls.length; i = i + 1){
			FreeLinkedListNumbers(lls[i]);
		}
		lls = undefined;
	}


	function LinkedListNumbersToArray(ll : LinkedListNumbers) : number []{
		var array : number [];
		var length : number, i : number;
		var node : LinkedListNodeNumbers;

		node = ll.first;

		length = LinkedListNumbersLength(ll);

		array = new Array<number>(length);

		for(i = 0; i < length; i = i + 1){
			array[i] = node.value;
			node = node.next;
		}

		return array;
	}


	function ArrayToLinkedListNumbers(array : number []) : LinkedListNumbers{
		var ll : LinkedListNumbers;
		var i : number;

		ll = CreateLinkedListNumbers();

		for(i = 0; i < array.length; i = i + 1){
			LinkedListAddNumber(ll, array[i]);
		}

		return ll;
	}


	function LinkedListNumbersEqual(a : LinkedListNumbers, b : LinkedListNumbers) : boolean{
		var equal : boolean, done : boolean;
		var an : LinkedListNodeNumbers, bn : LinkedListNodeNumbers;

		an = a.first;
		bn = b.first;

		equal = true;
		done = false;
		for(; equal && !done; ){
			if(an.end == bn.end){
				if(an.end){
					done = true;
				}else if(an.value == bn.value){
					an = an.next;
					bn = bn.next;
				}else{
					equal = false;
				}
			}else{
				equal = false;
			}
		}

		return equal;
	}


	function CreateLinkedListCharacter() : LinkedListCharacters{
		var ll : LinkedListCharacters;

		ll = new LinkedListCharacters();
		ll.first = new LinkedListNodeCharacters();
		ll.last = ll.first;
		ll.last.end = true;

		return ll;
	}


	function LinkedListAddCharacter(ll : LinkedListCharacters, value : string) : void{
		ll.last.end = false;
		ll.last.value = value;
		ll.last.next = new LinkedListNodeCharacters();
		ll.last.next.end = true;
		ll.last = ll.last.next;
	}


	function LinkedListCharactersToArray(ll : LinkedListCharacters) : string []{
		var array : string [];
		var length : number, i : number;
		var node : LinkedListNodeCharacters;

		node = ll.first;

		length = LinkedListCharactersLength(ll);

		array = new Array<string>(length);

		for(i = 0; i < length; i = i + 1){
			array[i] = node.value;
			node = node.next;
		}

		return array;
	}


	function LinkedListCharactersLength(ll : LinkedListCharacters) : number{
		var l : number;
		var node : LinkedListNodeCharacters;

		l = 0;
		node = ll.first;
		for(; !node.end; ){
			node = node.next;
			l = l + 1;
		}

		return l;
	}


	function FreeLinkedListCharacter(ll : LinkedListCharacters) : void{
		var node : LinkedListNodeCharacters, prev : LinkedListNodeCharacters;

		node = ll.first;

		for(; !node.end; ){
			prev = node;
			node = node.next;
			prev = undefined;
		}

		node = undefined;
	}


	function LinkedListCharactersAddString(ll : LinkedListCharacters, str : string []) : void{
		var i : number;

		for(i = 0; i < str.length; i = i + 1){
			LinkedListAddCharacter(ll, str[i]);
		}
	}


	function LinkedListInsertCharacter(ll : LinkedListCharacters, index : number, value : string) : void{
		var i : number;
		var node : LinkedListNodeCharacters, tmp : LinkedListNodeCharacters;

		if(index == 0){
			tmp = ll.first;
			ll.first = new LinkedListNodeCharacters();
			ll.first.next = tmp;
			ll.first.value = value;
			ll.first.end = false;
		}else{
			node = ll.first;
			for(i = 0; i < index - 1; i = i + 1){
				node = node.next;
			}

			tmp = node.next;
			node.next = new LinkedListNodeCharacters();
			node.next.next = tmp;
			node.next.value = value;
			node.next.end = false;
		}
	}


	function CreateDynamicArrayNumbers() : DynamicArrayNumbers{
		var da : DynamicArrayNumbers;

		da = new DynamicArrayNumbers();
		da.array = new Array<number>(10);
		da.length = 0;

		return da;
	}


	function CreateDynamicArrayNumbersWithInitialCapacity(capacity : number) : DynamicArrayNumbers{
		var da : DynamicArrayNumbers;

		da = new DynamicArrayNumbers();
		da.array = new Array<number>(capacity);
		da.length = 0;

		return da;
	}


	function DynamicArrayAddNumber(da : DynamicArrayNumbers, value : number) : void{
		if(da.length == da.array.length){
			DynamicArrayNumbersIncreaseSize(da);
		}

		da.array[da.length] = value;
		da.length = da.length + 1;
	}


	function DynamicArrayNumbersIncreaseSize(da : DynamicArrayNumbers) : void{
		var newLength : number, i : number;
		var newArray : number [];

		newLength = Math.round(da.array.length*3/2);
		newArray = new Array<number>(newLength);

		for(i = 0; i < da.array.length; i = i + 1){
			newArray[i] = da.array[i];
		}

		delete da.array;

		da.array = newArray;
	}


	function DynamicArrayNumbersDecreaseSizeNecessary(da : DynamicArrayNumbers) : boolean{
		var needsDecrease : boolean;

		needsDecrease = false;

		if(da.length > 10){
			needsDecrease = da.length <= Math.round(da.array.length*2/3);
		}

		return needsDecrease;
	}


	function DynamicArrayNumbersDecreaseSize(da : DynamicArrayNumbers) : void{
		var newLength : number, i : number;
		var newArray : number [];

		newLength = Math.round(da.array.length*2/3);
		newArray = new Array<number>(newLength);

		for(i = 0; i < newLength; i = i + 1){
			newArray[i] = da.array[i];
		}

		delete da.array;

		da.array = newArray;
	}


	function DynamicArrayNumbersIndex(da : DynamicArrayNumbers, index : number) : number{
		return da.array[index];
	}


	function DynamicArrayNumbersLength(da : DynamicArrayNumbers) : number{
		return da.length;
	}


	function DynamicArrayInsertNumber(da : DynamicArrayNumbers, index : number, value : number) : void{
		var i : number;

		if(da.length == da.array.length){
			DynamicArrayNumbersIncreaseSize(da);
		}

		for(i = da.length; i > index; i = i - 1){
			da.array[i] = da.array[i - 1];
		}

		da.array[index] = value;

		da.length = da.length + 1;
	}


	function DynamicArrayNumberSet(da : DynamicArrayNumbers, index : number, value : number) : boolean{
		var success : boolean;

		if(index < da.length){
			da.array[index] = value;
			success = true;
		}else{
			success = false;
		}

		return success;
	}


	function DynamicArrayRemoveNumber(da : DynamicArrayNumbers, index : number) : void{
		var i : number;

		for(i = index; i < da.length - 1; i = i + 1){
			da.array[i] = da.array[i + 1];
		}

		da.length = da.length - 1;

		if(DynamicArrayNumbersDecreaseSizeNecessary(da)){
			DynamicArrayNumbersDecreaseSize(da);
		}
	}


	function FreeDynamicArrayNumbers(da : DynamicArrayNumbers) : void{
		delete da.array;
		da = undefined;
	}


	function DynamicArrayNumbersToArray(da : DynamicArrayNumbers) : number []{
		var array : number [];
		var i : number;

		array = new Array<number>(da.length);

		for(i = 0; i < da.length; i = i + 1){
			array[i] = da.array[i];
		}

		return array;
	}


	function ArrayToDynamicArrayNumbersWithOptimalSize(array : number []) : DynamicArrayNumbers{
		var da : DynamicArrayNumbers;
		var i : number;
		var c : number, n : number, newCapacity : number;

		/*
         c = 10*(3/2)^n
         log(c) = log(10*(3/2)^n)
         log(c) = log(10) + log((3/2)^n)
         log(c) = 1 + log((3/2)^n)
         log(c) - 1 = log((3/2)^n)
         log(c) - 1 = n*log(3/2)
         n = (log(c) - 1)/log(3/2)
        */
		c = array.length;
		n = (Math.log(c) - 1)/Math.log(3/2);
		newCapacity = Math.ceil(10*(3/2)**n);

		da = CreateDynamicArrayNumbersWithInitialCapacity(newCapacity);

		for(i = 0; i < array.length; i = i + 1){
			da.array[i] = array[i];
		}

		return da;
	}


	function ArrayToDynamicArrayNumbers(array : number []) : DynamicArrayNumbers{
		var da : DynamicArrayNumbers;

		da = new DynamicArrayNumbers();
		da.array = CopyNumberArray(array);
		da.length = array.length;

		return da;
	}


	function DynamicArrayNumbersEqual(a : DynamicArrayNumbers, b : DynamicArrayNumbers) : boolean{
		var equal : boolean;
		var i : number;

		equal = true;
		if(a.length == b.length){
			for(i = 0; i < a.length && equal; i = i + 1){
				if(a.array[i] != b.array[i]){
					equal = false;
				}
			}
		}else{
			equal = false;
		}

		return equal;
	}


	function DynamicArrayNumbersToLinkedList(da : DynamicArrayNumbers) : LinkedListNumbers{
		var ll : LinkedListNumbers;
		var i : number;

		ll = CreateLinkedListNumbers();

		for(i = 0; i < da.length; i = i + 1){
			LinkedListAddNumber(ll, da.array[i]);
		}

		return ll;
	}


	function LinkedListToDynamicArrayNumbers(ll : LinkedListNumbers) : DynamicArrayNumbers{
		var da : DynamicArrayNumbers;
		var i : number;
		var node : LinkedListNodeNumbers;

		node = ll.first;

		da = new DynamicArrayNumbers();
		da.length = LinkedListNumbersLength(ll);

		da.array = new Array<number>(da.length);

		for(i = 0; i < da.length; i = i + 1){
			da.array[i] = node.value;
			node = node.next;
		}

		return da;
	}


	function DynamicArrayNumbersIndexOf(arr : DynamicArrayNumbers, n : number, foundReference : BooleanReference) : number{
		var found : boolean;
		var i : number;

		found = false;
		for(i = 0; i < arr.length && !found; i = i + 1){
			if(arr.array[i] == n){
				found = true;
			}
		}
		if(!found){
			i = -1;
		}else{
			i = i - 1;
		}

		foundReference.booleanValue = found;

		return i;
	}


	function DynamicArrayNumbersIsInArray(arr : DynamicArrayNumbers, n : number) : boolean{
		var found : boolean;
		var i : number;

		found = false;
		for(i = 0; i < arr.length && !found; i = i + 1){
			if(arr.array[i] == n){
				found = true;
			}
		}

		return found;
	}


	function AddCharacter(list : string [], a : string) : string []{
		var newlist : string [];
		var i : number;

		newlist = new Array<string>(list.length + 1);
		for(i = 0; i < list.length; i = i + 1){
			newlist[i] = list[i];
		}
		newlist[list.length] = a;
		
		list = undefined;
		
		return newlist;
	}


	function AddCharacterRef(list : StringReference, i : string) : void{
		list.stringx = AddCharacter(list.stringx, i);
	}


	function RemoveCharacter(list : string [], n : number) : string []{
		var newlist : string [];
		var i : number;

		newlist = new Array<string>(list.length - 1);

		if(n >= 0 && n < list.length){
			for(i = 0; i < list.length; i = i + 1){
				if(i < n){
					newlist[i] = list[i];
				}
				if(i > n){
					newlist[i - 1] = list[i];
				}
			}

			list = undefined;
		}else{
			newlist = undefined;
		}

		return newlist;
	}


	function GetCharacterRef(list : StringReference, i : number) : string{
		return list.stringx[i];
	}


	function RemoveCharacterRef(list : StringReference, i : number) : void{
		list.stringx = RemoveCharacter(list.stringx, i);
	}


	function AssertFalse(b : boolean, failures : NumberReference) : void{
		if(b){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertTrue(b : boolean, failures : NumberReference) : void{
		if(!b){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertEquals(a : number, b : number, failures : NumberReference) : void{
		if(a != b){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertBooleansEqual(a : boolean, b : boolean, failures : NumberReference) : void{
		if(a != b){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertCharactersEqual(a : string, b : string, failures : NumberReference) : void{
		if(a != b){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertStringEquals(a : string [], b : string [], failures : NumberReference) : void{
		if(!StringsEqual(a, b)){
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertNumberArraysEqual(a : number [], b : number [], failures : NumberReference) : void{
		var i : number;

		if(a.length == b.length){
			for(i = 0; i < a.length; i = i + 1){
				AssertEquals(a[i], b[i], failures);
			}
		}else{
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertBooleanArraysEqual(a : boolean [], b : boolean [], failures : NumberReference) : void{
		var i : number;

		if(a.length == b.length){
			for(i = 0; i < a.length; i = i + 1){
				AssertBooleansEqual(a[i], b[i], failures);
			}
		}else{
			failures.numberValue = failures.numberValue + 1;
		}
	}


	function AssertStringArraysEqual(a : StringReference [], b : StringReference [], failures : NumberReference) : void{
		var i : number;

		if(a.length == b.length){
			for(i = 0; i < a.length; i = i + 1){
				AssertStringEquals(a[i].stringx, b[i].stringx, failures);
			}
		}else{
			failures.numberValue = failures.numberValue + 1;
		}
	}


