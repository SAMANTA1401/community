# your_project/numba/decorators.py

from numba import jit, vectorize, guvectorize

# Export only what older code expects
__all__ = ['jit', 'vectorize', 'guvectorize']
