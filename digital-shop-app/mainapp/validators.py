from django.core.exceptions import ValidationError


def validate_whitespaces(value):
	if ' ' in value:
		raise ValidationError(
			'This string cannot contain any whitespace characters.',
			params={'value': value}
		)

#if __name__ == '__main__':
#	s = '1e qwe'
#	s1 = 'etertert'
#	s2 = ' eqwe '
#	s3 = ' easq'
#	s4 = 'asdasd '
#
#	validate_whitespaces(s4)
#	print('ok')