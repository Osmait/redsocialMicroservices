from unittest.mock import Mock, patch
from Comment import Comment
from comment_service import CommentService
from comment_model import CommentDto

import pytest


@pytest.fixture
def comment_service():
    mock_db = Mock()
    return CommentService(mock_db)

# Prueba para create utilizando Mock


def test_create(comment_service):
    # Configura un Mock para el comentario
    mock_comment = Mock(spec=CommentDto)

    # Configura un Mock para el objeto de comentario de base de datos
    mock_db_comment = Mock()
    mock_db_comment.return_value = None

    # Utiliza patch para reemplazar el comportamiento real de CommentDto.model_dump
    with patch.object(mock_comment, 'model_dump', return_value={}):
        # Configura el método add de la base de datos para retornar el Mock de comentario de base de datos
        comment_service.db.add.return_value = mock_db_comment
        # Ejecuta la función create
        result = comment_service.create(mock_comment)
    # # Verifica que el método commit de la base de datos se haya llamado una vez
    comment_service.db.commit.assert_called_once()

    # Verifica que la función create retorne None (o el valor que decidas retornar en CommentService.create)
    assert result is None

# Prueba para find_all_by_id utilizando Mock


def test_find_all_by_id(comment_service):
    fake_comment_data = {
        "content": "Fake Comment Text",
        "user_id": "user123",
        "post_id": "post456",
    }
    # Configura un Mock de Comment para simular la base de datos
    mock_comment = Comment(**fake_comment_data)

    # Configura la función filter para devolver los comentarios simulados según el post_id
    comment_service.db.query(Comment).filter(
        Comment.post_id == "post456").all.return_value = [mock_comment]

    # Llama a la función find_all_by_id con un post_id específico
    comments = comment_service.find_all_by_id("post456")

    # Verifica que la función devuelva los comentarios correctos según el post_id
    assert len(comments) == 1
