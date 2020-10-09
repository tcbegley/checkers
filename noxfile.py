import nox

SOURCES = ["backend", "tests", "noxfile.py"]


@nox.session()
def lint(session):
    """Lint Python source"""
    session.install("black", "flake8", "isort", "mypy")
    session.run("black", "--check", *SOURCES)
    session.run("flake8", *SOURCES)
    session.run("isort", "--check", *SOURCES)
    session.run("mypy", *SOURCES)


@nox.session(python=["3.7", "3.8"])
def test(session):
    """Run tests"""
    session.install("poetry")
    env = {"VIRTUAL_ENV": session.virtualenv.location}
    session.chdir("backend")
    session.run("poetry", "install", "--no-dev", env=env, external=True)
    session.chdir("..")
    session.install("pytest")
    session.run("pytest")
